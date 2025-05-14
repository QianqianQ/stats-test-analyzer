#!/bin/bash

# This script builds a simple HTML/JS frontend instead of Angular
# since we're having issues with Angular CLI

mkdir -p frontend/dist/frontend

cat > frontend/dist/frontend/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A/B Test Statistical Significance Calculator</title>
    
    <!-- Bootstrap CSS (Replit dark theme) -->
    <link rel="stylesheet" href="https://cdn.replit.com/agent/bootstrap-agent-dark-theme.min.css">
    
    <!-- FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Custom CSS -->
    <style>
        /* Add some space between form elements */
        .mb-3 {
            margin-bottom: 1.5rem;
        }
        
        /* Improve readability of display numbers */
        .display-4 {
            font-size: 2.5rem;
            font-weight: 600;
        }
        
        /* Customize chart containers */
        canvas {
            width: 100%;
            height: 100%;
        }
        
        /* Customize alerts */
        .alert-heading {
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
        }
        
        /* Make sure tables don't get too wide */
        .table-sm td {
            padding: 0.5rem;
        }
        
        /* Proper form validation styles */
        .form-control.is-invalid {
            border-color: var(--bs-danger);
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right calc(.375em + .1875rem) center;
            background-size: calc(.75em + .375rem) calc(.75em + .375rem);
        }
        
        /* Additional styling for percentages in tables */
        .text-end {
            font-weight: 500;
        }
        
        /* Loading indicator */
        .spinner-border {
            width: 3rem;
            height: 3rem;
        }
        
        /* Responsive adjustments for small screens */
        @media (max-width: 576px) {
            .display-4 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="/">
                <i class="fas fa-chart-bar me-2"></i>
                A/B Test Significance Calculator
            </a>
        </div>
    </nav>

    <main class="container my-4">
        <div class="row">
            <div class="col-lg-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title mb-0">A/B Test Statistical Significance Calculator</h3>
                    </div>
                    <div class="card-body">
                        <p class="lead">
                            Enter your A/B test data to calculate statistical significance, confidence intervals, and effect sizes.
                        </p>
                        <p>
                            This calculator helps determine if your A/B test results represent a genuine difference between variants
                            or if they might be due to random chance.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-6">
                <div class="card mb-4">
                    <div class="card-header">
                        <h4 class="card-title mb-0">Test Data Input</h4>
                    </div>
                    <div class="card-body">
                        <form id="ab-test-form">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="card bg-secondary">
                                        <div class="card-header">
                                            <h5 class="mb-0">Control Group (A)</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="control-size" class="form-label">Sample Size</label>
                                                <input type="number" class="form-control" id="control-size" placeholder="e.g., 1000" min="1" required>
                                                <div class="form-text">Total number of users/sessions in control group</div>
                                            </div>
                                            <div class="mb-3">
                                                <label for="control-conversions" class="form-label">Conversions</label>
                                                <input type="number" class="form-control" id="control-conversions" placeholder="e.g., 150" min="0" required>
                                                <div class="form-text">Number of successful conversions in control group</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card bg-secondary">
                                        <div class="card-header">
                                            <h5 class="mb-0">Variation Group (B)</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="variation-size" class="form-label">Sample Size</label>
                                                <input type="number" class="form-control" id="variation-size" placeholder="e.g., 1000" min="1" required>
                                                <div class="form-text">Total number of users/sessions in variation group</div>
                                            </div>
                                            <div class="mb-3">
                                                <label for="variation-conversions" class="form-label">Conversions</label>
                                                <input type="number" class="form-control" id="variation-conversions" placeholder="e.g., 180" min="0" required>
                                                <div class="form-text">Number of successful conversions in variation group</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">Calculate Results</button>
                        </form>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        <h4 class="card-title mb-0">Statistical Concepts</h4>
                    </div>
                    <div class="card-body">
                        <div class="accordion" id="accordionConcepts">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingOne">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                        Statistical Significance
                                    </button>
                                </h2>
                                <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionConcepts">
                                    <div class="accordion-body">
                                        <p>Statistical significance indicates whether an observed difference between test variants is likely to be real or due to random chance. A p-value less than 0.05 (5%) is commonly used as the threshold for significance, meaning there's less than a 5% probability that the difference occurred by chance.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingTwo">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        Confidence Intervals
                                    </button>
                                </h2>
                                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionConcepts">
                                    <div class="accordion-body">
                                        <p>A confidence interval provides a range of values within which the true value is likely to fall with a specified level of confidence (typically 95%). Wider intervals indicate less precision in estimates, while narrower intervals suggest more precise measurements.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingThree">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        Effect Size
                                    </button>
                                </h2>
                                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionConcepts">
                                    <div class="accordion-body">
                                        <p>Effect size measures the magnitude of the difference between groups. While statistical significance tells you if a difference exists, effect size tells you how big and meaningful that difference is. Cohen's h is used for proportions and has these common interpretations:</p>
                                        <ul>
                                            <li>Small effect: h ≈ 0.2</li>
                                            <li>Medium effect: h ≈ 0.5</li>
                                            <li>Large effect: h ≈ 0.8</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-6">
                <!-- Results section, initially hidden -->
                <div id="results-section" class="d-none">
                    <div class="card mb-4">
                        <div class="card-header">
                            <h4 class="card-title mb-0">Test Results</h4>
                        </div>
                        <div class="card-body">
                            <div id="significance-alert" class="alert mb-4" role="alert">
                                <!-- Will be populated with JS -->
                            </div>
                            
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card bg-dark">
                                        <div class="card-header">
                                            <h5 class="mb-0">Control (A)</h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="display-4 text-center mb-0" id="control-rate">-</p>
                                            <p class="text-center text-muted mb-3">Conversion Rate</p>
                                            <p class="text-center mb-0" id="control-ci">95% CI: [-]</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card bg-dark">
                                        <div class="card-header">
                                            <h5 class="mb-0">Variation (B)</h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="display-4 text-center mb-0" id="variation-rate">-</p>
                                            <p class="text-center text-muted mb-3">Conversion Rate</p>
                                            <p class="text-center mb-0" id="variation-ci">95% CI: [-]</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <h5 class="mb-3">Conversion Rate Comparison</h5>
                            <div style="height: 250px">
                                <canvas id="conversion-chart"></canvas>
                            </div>
                            
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <div class="card bg-dark mb-3">
                                        <div class="card-header">
                                            <h5 class="mb-0">Difference</h5>
                                        </div>
                                        <div class="card-body">
                                            <table class="table table-sm">
                                                <tbody>
                                                    <tr>
                                                        <td>Absolute</td>
                                                        <td id="absolute-diff" class="text-end">-</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Relative</td>
                                                        <td id="relative-diff" class="text-end">-</td>
                                                    </tr>
                                                    <tr>
                                                        <td>95% CI</td>
                                                        <td id="diff-ci" class="text-end">-</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card bg-dark mb-3">
                                        <div class="card-header">
                                            <h5 class="mb-0">Statistical Tests</h5>
                                        </div>
                                        <div class="card-body">
                                            <table class="table table-sm">
                                                <tbody>
                                                    <tr>
                                                        <td>Z-Score</td>
                                                        <td id="z-score" class="text-end">-</td>
                                                    </tr>
                                                    <tr>
                                                        <td>P-Value</td>
                                                        <td id="p-value" class="text-end">-</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Effect Size</td>
                                                        <td id="effect-size" class="text-end">-</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="sample-size-recommendation" class="d-none mt-3 alert alert-info">
                                <!-- Will be populated with JS if needed -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Loading indicator -->
                <div id="loading-indicator" class="d-none text-center my-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Calculating results...</p>
                </div>
                
                <!-- Error alert -->
                <div id="error-alert" class="d-none alert alert-danger mt-3" role="alert">
                    <!-- Will be populated with JS -->
                </div>
            </div>
        </div>
    </main>

    <footer class="container py-3 mt-4 border-top">
        <div class="row">
            <div class="col-12 text-center text-muted">
                <p class="mb-1">A/B Test Statistical Significance Calculator</p>
                <p class="mb-0 small">Built with Flask, Bootstrap, and Chart.js</p>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- App JS -->
    <script>
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
            fetch('/api/calculate', {
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

        // Set some default values
        document.getElementById('control-size').value = 1000;
        document.getElementById('control-conversions').value = 150;
        document.getElementById('variation-size').value = 1000;
        document.getElementById('variation-conversions').value = 180;
    </script>
</body>
</html>
EOL

echo "Built vanilla JS frontend instead of Angular due to Angular CLI issues"