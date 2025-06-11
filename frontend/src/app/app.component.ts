import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbTestFormComponent } from './components/ab-test-form/ab-test-form.component';
import { AbTestResultsComponent } from './components/ab-test-results/ab-test-results.component';
import { StatisticalConceptsComponent } from './components/statistical-concepts/statistical-concepts.component';
import { AbTestResults } from './models/ab-test.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AbTestFormComponent, AbTestResultsComponent, StatisticalConceptsComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="/">
          <i class="fas fa-chart-line me-2"></i>
          Statistical Testing Platform
        </a>
      </div>
    </nav>

    <main class="container my-5">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="card-body text-center py-5">
          <h1 class="hero-title mb-4">Statistical Significance Testing Platform</h1>
          <p class="lead mb-4" style="color: rgba(255, 255, 255, 0.9); font-size: 1.1rem;">
            Enterprise-grade A/B test analysis with comprehensive statistical metrics and confidence intervals
          </p>
          <div class="row text-center mt-4">
            <div class="col-md-4">
              <div class="d-flex align-items-center justify-content-center mb-2">
                <div class="metric-icon primary me-3">
                  <i class="fas fa-chart-line"></i>
                </div>
                <span style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">Statistical Testing</span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="d-flex align-items-center justify-content-center mb-2">
                <div class="metric-icon info me-3">
                  <i class="fas fa-chart-bar"></i>
                </div>
                <span style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">Data Visualization</span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="d-flex align-items-center justify-content-center mb-2">
                <div class="metric-icon accent me-3">
                  <i class="fas fa-microscope"></i>
                </div>
                <span style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">Research Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Test Data Input - Full Width -->
      <div class="row">
        <div class="col-12">
          <app-ab-test-form 
            (calculationStarted)="onCalculationStarted()"
            (resultsCalculated)="onResultsCalculated($event)"
            (calculationError)="onCalculationError($event)">
          </app-ab-test-form>
        </div>
      </div>
      
      <!-- Results Section -->
      <div class="row" *ngIf="testResults || loading || error">
        <div class="col-12">
          <!-- Error Alert -->
          <div *ngIf="error" class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ error }}
          </div>
          
          <!-- Loading Indicator -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Calculating statistical significance...</p>
          </div>
          
          <!-- Results -->
          <app-ab-test-results 
            *ngIf="testResults" 
            [results]="testResults">
          </app-ab-test-results>
        </div>
      </div>
      
      <!-- Statistical Concepts -->
      <div class="row mt-5">
        <div class="col-12">
          <app-statistical-concepts></app-statistical-concepts>
        </div>
      </div>
    </main>
  `
})
export class AppComponent {
  testResults: AbTestResults | null = null;
  loading = false;
  error: string | null = null;

  onResultsCalculated(results: AbTestResults): void {
    this.testResults = results;
    this.loading = false;
    this.error = null;
  }

  onCalculationStarted(): void {
    this.loading = true;
    this.error = null;
    this.testResults = null;
  }

  onCalculationError(errorMessage: string): void {
    this.error = errorMessage;
    this.loading = false;
    this.testResults = null;
  }
}