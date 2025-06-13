import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbTestResults } from '../../models/ab-test.model';

declare var Chart: any;

@Component({
  selector: 'app-ab-test-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card mb-4">
      <div class="card-header">
        <h3 class="card-title mb-0">
          <i class="fas fa-chart-bar me-2"></i>
          Statistical Results
        </h3>
      </div>
      <div class="card-body">
        <!-- Significance Status -->
        <div [class]="significanceStatus" class="alert mb-4" role="alert">
          <h4 class="alert-heading">
            <i [class]="'fas me-2 ' + (results.results.is_significant ? 'fa-check-circle' : 'fa-exclamation-triangle')"></i>
            {{ results.results.is_significant ? 'Statistically Significant' : 'Not Statistically Significant' }}
          </h4>
          <p class="mb-0">{{ significanceMessage }}</p>
        </div>
        
        <!-- Key Metrics -->
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="metric-card text-center">
              <h6 class="text-muted mb-2">Control Rate</h6>
              <div class="display-4">{{ controlRate }}</div>
              <small class="text-muted">{{ controlCI }}</small>
            </div>
          </div>
          <div class="col-md-6">
            <div class="metric-card text-center">
              <h6 class="text-muted mb-2">Variation Rate</h6>
              <div class="display-4">{{ variationRate }}</div>
              <small class="text-muted">{{ variationCI }}</small>
            </div>
          </div>
        </div>
        
        <h5 class="mb-3">
          <i class="fas fa-chart-bar me-2"></i>
          Conversion Rate Comparison
        </h5>
        <div class="chart-container" style="height: 250px">
          <canvas #chart></canvas>
        </div>
        
        <div class="row mt-4">
          <div class="col-md-6">
            <div class="metric-card mb-3">
              <div class="d-flex align-items-center mb-3">
                <div class="metric-icon info me-3">
                  <i class="fas fa-chart-line"></i>
                </div>
                <h5 class="mb-0">Difference Analysis</h5>
              </div>
              <div class="table-responsive">
                <table class="table table-sm">
                  <tbody>
                    <tr>
                      <td>Absolute</td>
                      <td class="text-end fw-bold">{{ absoluteDiff }}</td>
                    </tr>
                    <tr>
                      <td>Relative</td>
                      <td class="text-end fw-bold">{{ relativeDiff }}</td>
                    </tr>
                    <tr>
                      <td>95% CI</td>
                      <td class="text-end fw-bold">{{ diffCI }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="metric-card mb-3">
              <div class="d-flex align-items-center mb-3">
                <div class="metric-icon primary me-3">
                  <i class="fas fa-flask"></i>
                </div>
                <h5 class="mb-0">Primary Statistical Tests</h5>
              </div>
              <div class="table-responsive">
                <table class="table table-sm">
                  <tbody>
                    <tr>
                      <td>Z-Score</td>
                      <td class="text-end fw-bold">{{ zScore }}</td>
                    </tr>
                    <tr>
                      <td>P-Value</td>
                      <td class="text-end fw-bold">{{ pValue }}</td>
                    </tr>
                    <tr>
                      <td>Effect Size</td>
                      <td class="text-end fw-bold">{{ effectSize }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Additional Statistical Tests -->
        <div class="row mt-3">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-microscope me-2"></i>
                  Comprehensive Statistical Test Results
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-6 mb-3">
                    <h6 class="fw-bold mb-3">
                      <i class="fas fa-calculator me-2"></i>
                      Exact Tests
                    </h6>
                    <div class="table-responsive">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>Test</th>
                            <th class="text-end">P-Value</th>
                            <th class="text-end">Additional Metric</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Fisher's Exact</td>
                            <td class="text-end">{{ formatPValue(results.statistical_tests.fishers_exact?.p_value) }}</td>
                            <td class="text-end">{{ formatOddsRatio(results.statistical_tests.fishers_exact?.odds_ratio) }}</td>
                          </tr>
                          <tr>
                            <td>Barnard's Exact</td>
                            <td class="text-end">{{ formatPValue(results.statistical_tests.barnards_exact?.p_value) }}</td>
                            <td class="text-end">{{ formatPercent(results.statistical_tests.barnards_exact?.pooled_rate) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="col-lg-6 mb-3">
                    <h6 class="fw-bold mb-3">
                      <i class="fas fa-chart-area me-2"></i>
                      Alternative Tests
                    </h6>
                    <div class="table-responsive">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>Test</th>
                            <th class="text-end">P-Value</th>
                            <th class="text-end">Test Statistic</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Chi-Square (Yates')</td>
                            <td class="text-end">{{ formatPValue(results.statistical_tests.chi2_contingency?.p_value) }}</td>
                            <td class="text-end">{{ formatStatistic(results.statistical_tests.chi2_contingency?.statistic) }}</td>
                          </tr>
                          <tr>
                            <td>G-Test (LRT)</td>
                            <td class="text-end">{{ formatPValue(results.statistical_tests.g_test?.p_value) }}</td>
                            <td class="text-end">{{ formatStatistic(results.statistical_tests.g_test?.statistic) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <!-- Test Descriptions -->
                <div class="row mt-3">
                  <div class="col-12">
                    <div class="alert alert-info">
                      <h6 class="alert-heading">
                        <i class="fas fa-info-circle me-2"></i>
                        Understanding Different Statistical Tests
                      </h6>
                      <div class="row">
                        <div class="col-md-6">
                          <ul class="mb-0">
                            <li><strong>Fisher's Exact:</strong> Best for small samples (n&lt;30)</li>
                            <li><strong>Barnard's Exact:</strong> More powerful than Fisher's for 2x2 tables</li>
                          </ul>
                        </div>
                        <div class="col-md-6">
                          <ul class="mb-0">
                            <li><strong>Chi-Square (Yates'):</strong> Standard test with continuity correction</li>
                            <li><strong>G-Test:</strong> Likelihood ratio test, often more accurate than chi-square</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="recommendedSampleSize > 0" class="mt-3 alert alert-info">
          <h5 class="alert-heading">
            <i class="fas fa-lightbulb me-2"></i>
            Sample Size Recommendation
          </h5>
          <p class="mb-0">
            To detect this effect size with 80% power, consider testing with approximately 
            <strong>{{ recommendedSampleSize.toLocaleString() }}</strong> users per group.
          </p>
        </div>
      </div>
    </div>
  `
})
export class AbTestResultsComponent implements OnChanges, AfterViewInit {
  @Input() results!: AbTestResults;
  @ViewChild('chart') chartCanvas!: ElementRef<HTMLCanvasElement>;

  // Display properties
  controlRate = '';
  controlCI = '';
  variationRate = '';
  variationCI = '';
  absoluteDiff = '';
  relativeDiff = '';
  diffCI = '';
  zScore = '';
  pValue = '';
  effectSize = '';
  significanceStatus: 'alert-success' | 'alert-warning' | 'alert-danger' = 'alert-success';
  significanceMessage = '';
  recommendedSampleSize = 0;

  private chart: any = null;

  constructor() { }

  ngAfterViewInit(): void {
    if (this.results) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results'] && this.results) {
      this.updateDisplayValues();
      if (this.chartCanvas) {
        this.createChart();
      }
    }
  }

  private createChart(): void {
    if (!this.chartCanvas || !this.results) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    
    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }
    
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Control (A)', 'Variation (B)'],
        datasets: [{
          label: 'Conversion Rate',
          data: [this.results.control.conversion_rate * 100, this.results.variation.conversion_rate * 100],
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
              label: function(context: any) {
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
              callback: function(value: any) {
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
      }
    });
  }

  formatPercent(value: number | undefined, decimals = 1): string {
    if (value === undefined || value === null) return 'N/A';
    return (value * 100).toFixed(decimals) + '%';
  }

  formatPValue(pValue: number | undefined): string {
    if (pValue === undefined || pValue === null) return 'N/A';
    if (pValue < 0.001) {
      return 'p < 0.001';
    } else if (pValue < 0.01) {
      return 'p < 0.01';
    } else {
      return 'p = ' + pValue.toFixed(3);
    }
  }

  formatOddsRatio(oddsRatio: number | undefined): string {
    if (oddsRatio === undefined || oddsRatio === null) return 'N/A';
    return 'OR: ' + oddsRatio.toFixed(3);
  }

  formatStatistic(statistic: number | undefined): string {
    if (statistic === undefined || statistic === null) return 'N/A';
    return statistic.toFixed(3);
  }

  private updateDisplayValues(): void {
    if (!this.results) return;

    // Basic results
    this.controlRate = this.formatPercent(this.results.control.conversion_rate, 2);
    this.variationRate = this.formatPercent(this.results.variation.conversion_rate, 2);
    
    // Confidence intervals
    this.controlCI = `95% CI: [${this.formatPercent(this.results.control.ci_lower, 2)} - ${this.formatPercent(this.results.control.ci_upper, 2)}]`;
    this.variationCI = `95% CI: [${this.formatPercent(this.results.variation.ci_lower, 2)} - ${this.formatPercent(this.results.variation.ci_upper, 2)}]`;
    
    // Difference analysis
    this.absoluteDiff = this.formatPercent(this.results.difference.absolute, 2);
    this.relativeDiff = this.results.difference.relative.toFixed(1) + '%';
    this.diffCI = `[${this.formatPercent(this.results.difference.ci_lower, 2)} - ${this.formatPercent(this.results.difference.ci_upper, 2)}]`;
    
    // Statistical tests
    this.zScore = this.results.statistical_tests.z_test.z_score.toFixed(3);
    this.pValue = this.formatPValue(this.results.statistical_tests.z_test.p_value);
    this.effectSize = `${this.results.effect_size.cohens_h.toFixed(3)} (${this.results.effect_size.interpretation})`;
    
    // Significance status
    if (this.results.results.is_significant) {
      this.significanceStatus = 'alert-success';
      this.significanceMessage = `The difference between groups is statistically significant (p ≤ 0.05). The variation shows a ${Math.abs(this.results.difference.relative).toFixed(1)}% ${this.results.difference.relative > 0 ? 'increase' : 'decrease'} in conversion rate.`;
    } else {
      this.significanceStatus = 'alert-warning';
      this.significanceMessage = `The difference between groups is not statistically significant (p > 0.05). Consider running the test longer or with larger sample sizes.`;
      this.recommendedSampleSize = this.results.results.recommended_sample_size;
    }
  }
}