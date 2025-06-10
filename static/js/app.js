// Format percentage values
function formatPercent(value, decimals = 1) {
    return (value * 100).toFixed(decimals) + '%';
}

// Format p-values for display
function formatPValue(pValue) {
    if (pValue < 0.001) {
        return 'p < 0.001';
    } else if (pValue < 0.01) {
        return 'p < 0.01';
    } else {
        return 'p = ' + pValue.toFixed(3);
    }
}

// Update conversion chart
function updateConversionChart(controlData, variationData) {
    const ctx = document.getElementById('conversion-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.conversionChart) {
        window.conversionChart.destroy();
    }
    
    window.conversionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Control (A)', 'Variation (B)'],
            datasets: [{
                label: 'Conversion Rate',
                data: [controlData.conversion_rate * 100, variationData.conversion_rate * 100],
                backgroundColor: [
                    'rgba(30, 64, 175, 0.8)',
                    'rgba(15, 118, 110, 0.8)'
                ],
                borderColor: [
                    'rgb(30, 64, 175)',
                    'rgb(15, 118, 110)'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Conversion Rate (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Test Groups'
                    }
                }
            }
        },
        plugins: [{
            afterDatasetDraw(chart, args, options) {
                const { ctx, data, chartArea: { top, bottom, left, right, width, height } } = chart;
                ctx.save();
                
                data.datasets[0].data.forEach((datapoint, index) => {
                    const { x, y } = chart.getDatasetMeta(0).data[index];
                    
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillStyle = '#1e293b';
                    ctx.font = '12px Inter, sans-serif';
                    ctx.fillText(datapoint.toFixed(2) + '%', x, y - 5);
                });
                
                ctx.restore();
            }
        }]
    });
}

// Show error message
function showError(message) {
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorAlert.classList.remove('d-none');
}

// Display test results
function displayResults(results) {
    // Show results section with animation
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.remove('d-none');
    resultsSection.classList.add('fade-in');
    
    // Basic results
    document.getElementById('control-rate').textContent = formatPercent(results.control.conversion_rate, 2);
    document.getElementById('variation-rate').textContent = formatPercent(results.variation.conversion_rate, 2);
    
    // Confidence intervals
    document.getElementById('control-ci').textContent = `95% CI: [${formatPercent(results.control.ci_lower, 2)} - ${formatPercent(results.control.ci_upper, 2)}]`;
    document.getElementById('variation-ci').textContent = `95% CI: [${formatPercent(results.variation.ci_lower, 2)} - ${formatPercent(results.variation.ci_upper, 2)}]`;
    
    // Difference analysis
    document.getElementById('absolute-diff').textContent = formatPercent(results.difference.absolute, 2);
    document.getElementById('relative-diff').textContent = results.difference.relative.toFixed(1) + '%';
    document.getElementById('diff-ci').textContent = `[${formatPercent(results.difference.ci_lower, 2)} - ${formatPercent(results.difference.ci_upper, 2)}]`;
    
    // Statistical tests
    document.getElementById('z-score').textContent = results.statistical_tests.z_test.z_score.toFixed(3);
    document.getElementById('p-value').textContent = formatPValue(results.statistical_tests.z_test.p_value);
    document.getElementById('effect-size').textContent = `${results.effect_size.cohens_h.toFixed(3)} (${results.effect_size.interpretation})`;
    
    // Significance status
    const statusElement = document.getElementById('significance-status');
    const iconElement = document.getElementById('significance-icon');
    const titleElement = document.getElementById('significance-title');
    const messageElement = document.getElementById('significance-message');
    
    if (results.results.is_significant) {
        statusElement.className = 'alert alert-success mb-4';
        iconElement.className = 'fas fa-check-circle me-2';
        titleElement.textContent = 'Statistically Significant';
        messageElement.textContent = `The difference between groups is statistically significant (p ≤ 0.05). The variation shows a ${Math.abs(results.difference.relative).toFixed(1)}% ${results.difference.relative > 0 ? 'increase' : 'decrease'} in conversion rate.`;
    } else {
        statusElement.className = 'alert alert-warning mb-4';
        iconElement.className = 'fas fa-exclamation-triangle me-2';
        titleElement.textContent = 'Not Statistically Significant';
        messageElement.textContent = `The difference between groups is not statistically significant (p > 0.05). Consider running the test longer or with larger sample sizes.`;
        
        // Show sample size recommendation
        const recommendationElement = document.getElementById('sample-size-recommendation');
        recommendationElement.innerHTML = `
            <h5 class="alert-heading">
                <i class="fas fa-lightbulb me-2"></i>
                Sample Size Recommendation
            </h5>
            <p class="mb-0">
                To detect this effect size with 80% power, consider testing with approximately 
                <strong>${results.results.recommended_sample_size.toLocaleString()}</strong> users per group.
            </p>
        `;
        recommendationElement.classList.remove('d-none');
    }
    
    // Update chart
    updateConversionChart(results.control, results.variation);
}

// Form submission handler
document.getElementById('ab-test-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Hide previous results and errors
    document.getElementById('results-section').classList.add('d-none');
    document.getElementById('error-alert').classList.add('d-none');
    document.getElementById('sample-size-recommendation').classList.add('d-none');
    
    // Show loading indicator
    document.getElementById('loading-indicator').classList.remove('d-none');
    
    // Get form data
    const formData = new FormData(this);
    const data = {
        control_size: parseInt(formData.get('control_size')),
        control_conversions: parseInt(formData.get('control_conversions')),
        variation_size: parseInt(formData.get('variation_size')),
        variation_conversions: parseInt(formData.get('variation_conversions'))
    };
    
    // Validate data
    if (data.control_conversions > data.control_size) {
        document.getElementById('loading-indicator').classList.add('d-none');
        showError('Control conversions cannot be greater than control sample size.');
        return;
    }
    
    if (data.variation_conversions > data.variation_size) {
        document.getElementById('loading-indicator').classList.add('d-none');
        showError('Variation conversions cannot be greater than variation sample size.');
        return;
    }
    
    try {
        // Send request to API
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        // Hide loading indicator
        document.getElementById('loading-indicator').classList.add('d-none');
        
        if (response.ok) {
            displayResults(result);
        } else {
            showError(result.error || 'An error occurred while calculating results.');
        }
    } catch (error) {
        // Hide loading indicator
        document.getElementById('loading-indicator').classList.add('d-none');
        showError('Network error: Unable to calculate results. Please try again.');
        console.error('Error:', error);
    }
});

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="number"]');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove any existing validation classes
            this.classList.remove('is-invalid');
            
            // Validate input
            const value = parseInt(this.value);
            const isConversion = this.name.includes('conversions');
            const isSize = this.name.includes('size');
            
            if (isSize && value <= 0) {
                this.classList.add('is-invalid');
            } else if (isConversion && value < 0) {
                this.classList.add('is-invalid');
            }
        });
    });
});