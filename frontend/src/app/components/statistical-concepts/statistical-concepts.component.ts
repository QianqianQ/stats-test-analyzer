import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

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
              <button class="accordion-button collapsed" type="button" (click)="toggleAccordion('#statistical-significance', $event)" aria-expanded="false">
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
              <button class="accordion-button collapsed" type="button" (click)="toggleAccordion('#confidence-intervals', $event)" aria-expanded="false">
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
              <button class="accordion-button collapsed" type="button" (click)="toggleAccordion('#effect-size', $event)" aria-expanded="false">
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
          
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" (click)="toggleAccordion('#statistical-tests', $event)" aria-expanded="false">
                Statistical Test Types
              </button>
            </h2>
            <div id="statistical-tests" class="accordion-collapse collapse" data-bs-parent="#concepts-accordion">
              <div class="accordion-body">
                <p>Different statistical tests are appropriate for different scenarios:</p>
                <ul>
                  <li><strong>Z-Test:</strong> Standard test for large samples with known variance</li>
                  <li><strong>Chi-Square Test:</strong> Tests independence between categorical variables</li>
                  <li><strong>Fisher's Exact Test:</strong> Exact test for small samples or when chi-square assumptions aren't met</li>
                  <li><strong>G-Test:</strong> Likelihood ratio test, often more accurate than chi-square</li>
                  <li><strong>Barnard's Exact Test:</strong> More powerful alternative to Fisher's exact test</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StatisticalConceptsComponent implements AfterViewInit {
  isExpanded = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    // Initialize Bootstrap accordion manually if needed
    this.initializeAccordion();
  }

  private initializeAccordion() {
    // Ensure Bootstrap is available and initialize accordion
    if (typeof bootstrap !== 'undefined') {
      const accordionElement = this.elementRef.nativeElement.querySelector('#concepts-accordion');
      if (accordionElement) {
        new bootstrap.Collapse(accordionElement, {
          toggle: false
        });
      }
    }
  }

  toggleAccordion(targetId: string, event: Event) {
    event.preventDefault();
    const target = this.elementRef.nativeElement.querySelector(targetId);
    const button = event.target as HTMLElement;
    
    if (target) {
      const isCollapsed = target.classList.contains('show');
      
      // Close all other accordion items
      const allItems = this.elementRef.nativeElement.querySelectorAll('.accordion-collapse');
      const allButtons = this.elementRef.nativeElement.querySelectorAll('.accordion-button');
      
      allItems.forEach((item: HTMLElement) => {
        if (item !== target) {
          item.classList.remove('show');
        }
      });
      
      allButtons.forEach((btn: HTMLElement) => {
        if (btn !== button) {
          btn.classList.add('collapsed');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current item
      if (isCollapsed) {
        target.classList.remove('show');
        button.classList.add('collapsed');
        button.setAttribute('aria-expanded', 'false');
      } else {
        target.classList.add('show');
        button.classList.remove('collapsed');
        button.setAttribute('aria-expanded', 'true');
      }
    }
  }
}