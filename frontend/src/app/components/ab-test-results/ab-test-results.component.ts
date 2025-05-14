import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbTestResults } from '../../models/ab-test.model';

@Component({
  selector: 'app-ab-test-results',
  templateUrl: './ab-test-results.component.html',
  styleUrls: ['./ab-test-results.component.scss']
})
export class AbTestResultsComponent implements OnChanges {
  @Input() results!: AbTestResults;

  // Display formatted values
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
  significanceStatus: 'success' | 'warning' | 'danger' = 'success';
  significanceMessage = '';
  recommendedSampleSize = 0;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results'] && this.results) {
      this.updateDisplayValues();
    }
  }

  // Format number as percentage
  formatPercent(value: number, decimals = 1): string {
    return (value * 100).toFixed(decimals) + '%';
  }

  // Format p-value with appropriate precision
  formatPValue(pValue: number): string {
    if (pValue < 0.0001) {
      return 'p < 0.0001';
    } else {
      return 'p = ' + pValue.toFixed(4);
    }
  }

  private updateDisplayValues(): void {
    // Basic results
    this.controlRate = this.formatPercent(this.results.control.conversion_rate, 2);
    this.variationRate = this.formatPercent(this.results.variation.conversion_rate, 2);
    
    // Confidence intervals
    this.controlCI = `95% CI: [${this.formatPercent(this.results.control.ci_lower, 2)} - ${this.formatPercent(this.results.control.ci_upper, 2)}]`;
    this.variationCI = `95% CI: [${this.formatPercent(this.results.variation.ci_lower, 2)} - ${this.formatPercent(this.results.variation.ci_upper, 2)}]`;
    
    // Difference
    this.absoluteDiff = this.formatPercent(this.results.difference.absolute, 2);
    this.relativeDiff = this.formatPercent(this.results.difference.relative / 100, 2);
    this.diffCI = `[${this.formatPercent(this.results.difference.ci_lower, 2)} - ${this.formatPercent(this.results.difference.ci_upper, 2)}]`;
    
    // Statistical tests
    this.zScore = this.results.statistical_tests.z_test.z_score.toFixed(2);
    this.pValue = this.formatPValue(this.results.statistical_tests.z_test.p_value);
    this.effectSize = `${this.results.effect_size.cohens_h.toFixed(3)} (${this.results.effect_size.interpretation})`;
    
    // Significance alert
    if (this.results.results.is_significant) {
      this.significanceStatus = 'success';
      this.significanceMessage = 'Your test results are statistically significant at the ' + 
                                this.results.results.confidence_level + '% confidence level. ' +
                                'We can be confident that the observed difference between variants is not due to random chance.';
    } else {
      // Check if close to significance
      const pValue = this.results.statistical_tests.z_test.p_value;
      if (pValue < 0.1) {
        this.significanceStatus = 'warning';
        this.significanceMessage = 'Your test results are not statistically significant at the ' + 
                                  this.results.results.confidence_level + '% confidence level, but they\'re close (' + 
                                  this.formatPValue(pValue) + '). You might need a larger sample size to detect a significant difference.';
      } else {
        this.significanceStatus = 'danger';
        this.significanceMessage = 'Your test results are not statistically significant at the ' + 
                                 this.results.results.confidence_level + '% confidence level. ' +
                                 'The observed difference between variants could be due to random chance.';
      }
      
      // Sample size recommendation
      this.recommendedSampleSize = this.results.results.recommended_sample_size;
    }
  }
}