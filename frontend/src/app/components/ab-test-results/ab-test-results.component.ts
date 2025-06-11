import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbTestResults } from '../../models/ab-test.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-ab-test-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card mb-4 fade-in">
      <div class="card-header">
        <h3 class="card-title mb-0">
          <i class="fas fa-chart-bar me-2"></i>
          Statistical Results
        </h3>
      </div>
      <div class="card-body">
        <!-- Significance Status -->
        <div [class]="'alert mb-4 ' + significanceStatus" role="alert">
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
                <h5 class="mb-0">Statistical Tests</h5>
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
        
        <div *ngIf="!results.results.is_significant" class="mt-3 alert alert-info">
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
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Control (A)', 'Variation (B)'],
        datasets: [{
          label: 'Conversion Rate',
          data: [
            this.results.control.conversion_rate * 100,
            this.results.variation.conversion_rate * 100
          ],
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
              label: (context) => {
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
              callback: (value) => value + '%'
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
        afterDatasetDraw(chart: any, args: any, options: any) {
          const { ctx, data, chartArea: { top, bottom, left, right, width, height } } = chart;
          ctx.save();
          
          data.datasets[0].data.forEach((datapoint: number, index: number) => {
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

  formatPercent(value: number, decimals = 1): string {
    return (value * 100).toFixed(decimals) + '%';
  }

  formatPValue(pValue: number): string {
    if (pValue < 0.001) {
      return 'p < 0.001';
    } else if (pValue < 0.01) {
      return 'p < 0.01';
    } else {
      return 'p = ' + pValue.toFixed(3);
    }
  }

  private updateDisplayValues(): void {
    this.controlRate = this.formatPercent(this.results.control.conversion_rate, 2);
    this.variationRate = this.formatPercent(this.results.variation.conversion_rate, 2);
    this.controlCI = `95% CI: [${this.formatPercent(this.results.control.ci_lower, 2)} - ${this.formatPercent(this.results.control.ci_upper, 2)}]`;
    this.variationCI = `95% CI: [${this.formatPercent(this.results.variation.ci_lower, 2)} - ${this.formatPercent(this.results.variation.ci_upper, 2)}]`;
    
    this.absoluteDiff = this.formatPercent(this.results.difference.absolute, 2);
    this.relativeDiff = this.results.difference.relative.toFixed(1) + '%';
    this.diffCI = `[${this.formatPercent(this.results.difference.ci_lower, 2)} - ${this.formatPercent(this.results.difference.ci_upper, 2)}]`;
    
    this.zScore = this.results.statistical_tests.z_test.z_score.toFixed(3);
    this.pValue = this.formatPValue(this.results.statistical_tests.z_test.p_value);
    this.effectSize = `${this.results.effect_size.cohens_h.toFixed(3)} (${this.results.effect_size.interpretation})`;
    
    this.recommendedSampleSize = this.results.results.recommended_sample_size;
    
    if (this.results.results.is_significant) {
      this.significanceStatus = 'alert-success';
      this.significanceMessage = `The difference between groups is statistically significant (p ≤ 0.05). The variation shows a ${Math.abs(this.results.difference.relative).toFixed(1)}% ${this.results.difference.relative > 0 ? 'increase' : 'decrease'} in conversion rate.`;
    } else {
      this.significanceStatus = 'alert-warning';
      this.significanceMessage = 'The difference between groups is not statistically significant (p > 0.05). Consider running the test longer or with larger sample sizes.';
    }
  }
}