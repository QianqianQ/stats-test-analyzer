import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistical-concepts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title mb-0">
          <i class="fas fa-book me-2"></i>
          Understanding Statistical Concepts
        </h3>
      </div>
      <div class="card-body">
        <div class="accordion" id="concepts-accordion">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#statistical-significance">
                Statistical Significance
              </button>
            </h2>
            <div id="statistical-significance" class="accordion-collapse collapse" data-bs-parent="#concepts-accordion">
              <div class="accordion-body">
                <p>Statistical significance indicates whether the observed difference between groups is likely due to a real effect rather than random chance. A result is typically considered statistically significant when p ≤ 0.05.</p>
                <ul>
                  <li><strong>P-value:</strong> The probability of observing the results if there was no real difference</li>
                  <li><strong>Confidence Level:</strong> Usually 95%, meaning we're 95% confident in our results</li>
                  <li><strong>Type I Error:</strong> Falsely concluding there's a difference when there isn't</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#confidence-intervals">
                Confidence Intervals
              </button>
            </h2>
            <div id="confidence-intervals" class="accordion-collapse collapse" data-bs-parent="#concepts-accordion">
              <div class="accordion-body">
                <p>Confidence intervals provide a range of values that likely contain the true conversion rate. A 95% confidence interval means that if we repeated the test 100 times, 95 intervals would contain the true value.</p>
                <ul>
                  <li><strong>Narrow intervals:</strong> More precise estimates (larger sample sizes)</li>
                  <li><strong>Wide intervals:</strong> Less precise estimates (smaller sample sizes)</li>
                  <li><strong>Overlapping intervals:</strong> May suggest no significant difference</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#effect-size">
                Effect Size
              </button>
            </h2>
            <div id="effect-size" class="accordion-collapse collapse" data-bs-parent="#concepts-accordion">
              <div class="accordion-body">
                <p>Effect size measures the practical significance of your results - how big the difference actually is, regardless of statistical significance.</p>
                <ul>
                  <li><strong>Cohen's h < 0.2:</strong> Small effect</li>
                  <li><strong>Cohen's h ≈ 0.5:</strong> Medium effect</li>
                  <li><strong>Cohen's h ≥ 0.8:</strong> Large effect</li>
                </ul>
                <p>A statistically significant result with a small effect size may not be practically meaningful for business decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bootstrap JS for accordion functionality -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  `
})
export class StatisticalConceptsComponent {

}