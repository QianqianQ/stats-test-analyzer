// Global chart instance
let conversionChart = null;

// Format number as percentage
function formatPercent(value, decimals = 1) {
    return (value * 100).toFixed(decimals) + '%';
}

// Format p-value with appropriate precision
function formatPValue(pValue) {
    if (pValue < 0.0001) {
        return 'p < 0.0001';
    } else {
        return 'p = ' + pValue.toFixed(4);
    }
}

// Create or update the conversion rate chart
function updateConversionChart(controlData, variationData) {
    const ctx = document.getElementById('conversion-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (conversionChart) {
        conversionChart.destroy();
    }
    
    // Create chart data
    const data = {
        labels: ['Control (A)', 'Variation (B)'],
        datasets: [{
            label: 'Conversion Rate',
            data: [
                controlData.conversion_rate,
                variationData.conversion_rate
            ],
            backgroundColor: [
                'rgba(54, 162, 235, 0.5)',
                'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)'
            ],
            borderWidth: 1
        }]
    };
    
    // Error bars data for confidence intervals
    const errorBars = {
        id: 'errorBars',
        afterDatasetDraw(chart, args, options) {
            const {ctx, data, chartArea, scales} = chart;
            
            // Set up drawing properties
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 2;
            
            // Draw error bars for each dataset point
            data.datasets.forEach((dataset, datasetIndex) => {
                // Only process the first dataset (our conversion rates)
                if (datasetIndex === 0) {
                    dataset.data.forEach((datapoint, index) => {
                        // Calculate the error bar bounds
                        let lowerBound, upperBound;
                        
                        if (index === 0) {
                            lowerBound = controlData.ci_lower;
                            upperBound = controlData.ci_upper;
                        } else {
                            lowerBound = variationData.ci_lower;
                            upperBound = variationData.ci_upper;
                        }
                        
                        // Convert to y-coordinates
                        const yLower = scales.y.getPixelForValue(upperBound);
                        const yUpper = scales.y.getPixelForValue(lowerBound);
                        
                        // Get x position
                        const x = scales.x.getPixelForValue(index);
                        
                        // Draw vertical line
                        ctx.beginPath();
                        ctx.moveTo(x, yLower);
                        ctx.lineTo(x, yUpper);
                        ctx.stroke();
                        
                        // Draw horizontal caps
                        const capWidth = 10;
                        
                        // Upper cap
                        ctx.beginPath();
                        ctx.moveTo(x - capWidth / 2, yLower);
                        ctx.lineTo(x + capWidth / 2, yLower);
                        ctx.stroke();
                        
                        // Lower cap
                        ctx.beginPath();
                        ctx.moveTo(x - capWidth / 2, yUpper);
                        ctx.lineTo(x + capWidth / 2, yUpper);
                        ctx.stroke();
                    });
                }
            });
        }
    };
    
    // Chart configuration
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatPercent(value, 1);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatPercent(context.raw, 2);
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        },
        plugins: [errorBars]
    };
    
    // Create the chart
    conversionChart = new Chart(ctx, config);
}

// Handle form submission
document.getElementById('ab-test-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Hide existing results and error messages
    document.getElementById('results-section').classList.add('d-none');
    document.getElementById('error-alert').classList.add('d-none');
    document.getElementById('sample-size-recommendation').classList.add('d-none');
    
    // Show loading indicator
    document.getElementById('loading-indicator').classList.remove('d-none');
    
    // Get form values
    const controlSize = parseInt(document.getElementById('control-size').value);
    const controlConversions = parseInt(document.getElementById('control-conversions').value);
    const variationSize = parseInt(document.getElementById('variation-size').value);
    const variationConversions = parseInt(document.getElementById('variation-conversions').value);
    
    // Client-side validation
    if (controlConversions > controlSize || variationConversions > variationSize) {
        showError('Conversion counts cannot exceed sample sizes');
        return;
    }
    
    // Prepare data for API request
    const data = {
        control_size: controlSize,
        control_conversions: controlConversions,
        variation_size: variationSize,
        variation_conversions: variationConversions
    };
    
    // Call the API
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'An error occurred during calculation');
            });
        }
        return response.json();
    })
    .then(results => {
        // Hide loading indicator
        document.getElementById('loading-indicator').classList.add('d-none');
        
        // Display results
        displayResults(results);
    })
    .catch(error => {
        // Hide loading indicator
        document.getElementById('loading-indicator').classList.add('d-none');
        
        // Show error message
        showError(error.message);
    });
});

// Display error message
function showError(message) {
    const errorAlert = document.getElementById('error-alert');
    errorAlert.textContent = message;
    errorAlert.classList.remove('d-none');
}

// Display test results
function displayResults(results) {
    // Show results section
    document.getElementById('results-section').classList.remove('d-none');
    
    // Basic results
    document.getElementById('control-rate').textContent = formatPercent(results.control.conversion_rate, 2);
    document.getElementById('variation-rate').textContent = formatPercent(results.variation.conversion_rate, 2);
    
    // Confidence intervals
    document.getElementById('control-ci').textContent = `95% CI: [${formatPercent(results.control.ci_lower, 2)} - ${formatPercent(results.control.ci_upper, 2)}]`;
    document.getElementById('variation-ci').textContent = `95% CI: [${formatPercent(results.variation.ci_lower, 2)} - ${formatPercent(results.variation.ci_upper, 2)}]`;
    
    // Difference
    document.getElementById('absolute-diff').textContent = formatPercent(results.difference.absolute, 2);
    document.getElementById('relative-diff').textContent = formatPercent(results.difference.relative / 100, 2);
    document.getElementById('diff-ci').textContent = `[${formatPercent(results.difference.ci_lower, 2)} - ${formatPercent(results.difference.ci_upper, 2)}]`;
    
    // Statistical tests
    document.getElementById('z-score').textContent = results.statistical_tests.z_test.z_score.toFixed(2);
    document.getElementById('p-value').textContent = formatPValue(results.statistical_tests.z_test.p_value);
    document.getElementById('effect-size').textContent = `${results.effect_size.cohens_h.toFixed(3)} (${results.effect_size.interpretation})`;
    
    // Significance alert
    const significanceAlert = document.getElementById('significance-alert');
    if (results.results.is_significant) {
        significanceAlert.classList.remove('alert-warning', 'alert-danger');
        significanceAlert.classList.add('alert-success');
        significanceAlert.innerHTML = `
            <h4 class="alert-heading"><i class="fas fa-check-circle me-2"></i>Statistically Significant!</h4>
            <p>Your test results are statistically significant at the ${results.results.confidence_level}% confidence level.</p>
            <p class="mb-0">We can be confident that the observed difference between variants is not due to random chance.</p>
        `;
    } else {
        // Check if close to significance
        const pValue = results.statistical_tests.z_test.p_value;
        if (pValue < 0.1) {
            significanceAlert.classList.remove('alert-success', 'alert-danger');
            significanceAlert.classList.add('alert-warning');
            significanceAlert.innerHTML = `
                <h4 class="alert-heading"><i class="fas fa-exclamation-triangle me-2"></i>Not Quite Significant</h4>
                <p>Your test results are not statistically significant at the ${results.results.confidence_level}% confidence level, but they're close (${formatPValue(pValue)}).</p>
                <p class="mb-0">You might need a larger sample size to detect a significant difference.</p>
            `;
        } else {
            significanceAlert.classList.remove('alert-success', 'alert-warning');
            significanceAlert.classList.add('alert-danger');
            significanceAlert.innerHTML = `
                <h4 class="alert-heading"><i class="fas fa-times-circle me-2"></i>Not Statistically Significant</h4>
                <p>Your test results are not statistically significant at the ${results.results.confidence_level}% confidence level.</p>
                <p class="mb-0">The observed difference between variants could be due to random chance.</p>
            `;
        }
        
        // Show sample size recommendation if available
        if (results.results.recommended_sample_size > 0) {
            const sampleSizeRec = document.getElementById('sample-size-recommendation');
            sampleSizeRec.classList.remove('d-none');
            sampleSizeRec.innerHTML = `
                <h5><i class="fas fa-lightbulb me-2"></i>Sample Size Recommendation</h5>
                <p>To detect a significant difference with 80% power, you would need approximately <strong>${results.results.recommended_sample_size}</strong> samples in each group.</p>
            `;
        }
    }
    
    // Update chart
    updateConversionChart(results.control, results.variation);
}
