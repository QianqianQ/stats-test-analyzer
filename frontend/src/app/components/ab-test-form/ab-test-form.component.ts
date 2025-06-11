import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbTestService } from '../../services/ab-test.service';
import { AbTestInput, AbTestResults } from '../../models/ab-test.model';

@Component({
  selector: 'app-ab-test-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card mb-4">
      <div class="card-header">
        <h3 class="card-title mb-0">
          <i class="fas fa-calculator me-2"></i>
          Test Data Input
        </h3>
      </div>
      <div class="card-body">
        <form [formGroup]="abTestForm" (ngSubmit)="onSubmit()">
          <div class="row">
            <div class="col-md-6">
              <h5 class="mb-3">Control Group (A)</h5>
              <div class="mb-3">
                <label for="control-size" class="form-label">Sample Size</label>
                <input 
                  type="number" 
                  id="control-size" 
                  formControlName="control_size" 
                  class="form-control" 
                  [class.is-invalid]="abTestForm.get('control_size')?.invalid && abTestForm.get('control_size')?.touched"
                  min="1" 
                  required>
                <div class="form-text">Total number of users in control group</div>
                <div *ngIf="abTestForm.get('control_size')?.invalid && abTestForm.get('control_size')?.touched" class="invalid-feedback">
                  Please enter a valid sample size (greater than 0).
                </div>
              </div>
              <div class="mb-3">
                <label for="control-conversions" class="form-label">Conversions</label>
                <input 
                  type="number" 
                  id="control-conversions" 
                  formControlName="control_conversions" 
                  class="form-control"
                  [class.is-invalid]="abTestForm.get('control_conversions')?.invalid && abTestForm.get('control_conversions')?.touched"
                  min="0" 
                  required>
                <div class="form-text">Number of users who converted</div>
                <div *ngIf="abTestForm.get('control_conversions')?.invalid && abTestForm.get('control_conversions')?.touched" class="invalid-feedback">
                  Please enter a valid number of conversions.
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <h5 class="mb-3">Variation Group (B)</h5>
              <div class="mb-3">
                <label for="variation-size" class="form-label">Sample Size</label>
                <input 
                  type="number" 
                  id="variation-size" 
                  formControlName="variation_size" 
                  class="form-control"
                  [class.is-invalid]="abTestForm.get('variation_size')?.invalid && abTestForm.get('variation_size')?.touched"
                  min="1" 
                  required>
                <div class="form-text">Total number of users in variation group</div>
                <div *ngIf="abTestForm.get('variation_size')?.invalid && abTestForm.get('variation_size')?.touched" class="invalid-feedback">
                  Please enter a valid sample size (greater than 0).
                </div>
              </div>
              <div class="mb-3">
                <label for="variation-conversions" class="form-label">Conversions</label>
                <input 
                  type="number" 
                  id="variation-conversions" 
                  formControlName="variation_conversions" 
                  class="form-control"
                  [class.is-invalid]="abTestForm.get('variation_conversions')?.invalid && abTestForm.get('variation_conversions')?.touched"
                  min="0" 
                  required>
                <div class="form-text">Number of users who converted</div>
                <div *ngIf="abTestForm.get('variation_conversions')?.invalid && abTestForm.get('variation_conversions')?.touched" class="invalid-feedback">
                  Please enter a valid number of conversions.
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="abTestForm.errors?.['conversionsSmallerThanSize']" class="alert alert-warning">
            <i class="fas fa-exclamation-triangle me-2"></i>
            Conversions cannot be greater than sample size.
          </div>
          
          <div class="d-grid">
            <button 
              type="submit" 
              class="btn btn-primary btn-lg"
              [disabled]="abTestForm.invalid || loading">
              <i class="fas fa-calculator me-2"></i>
              <span *ngIf="!loading">Calculate Statistical Significance</span>
              <span *ngIf="loading">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Calculating...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AbTestFormComponent {
  @Output() calculationStarted = new EventEmitter<void>();
  @Output() resultsCalculated = new EventEmitter<AbTestResults>();
  @Output() calculationError = new EventEmitter<string>();

  abTestForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private abTestService: AbTestService
  ) {
    this.abTestForm = this.fb.group({
      control_size: ['', [Validators.required, Validators.min(1)]],
      control_conversions: ['', [Validators.required, Validators.min(0)]],
      variation_size: ['', [Validators.required, Validators.min(1)]],
      variation_conversions: ['', [Validators.required, Validators.min(0)]]
    }, { validators: this.conversionsSmallerThanSizeValidator });
  }

  conversionsSmallerThanSizeValidator(form: FormGroup): { [key: string]: boolean } | null {
    const controlSize = form.get('control_size')?.value;
    const controlConversions = form.get('control_conversions')?.value;
    const variationSize = form.get('variation_size')?.value;
    const variationConversions = form.get('variation_conversions')?.value;

    if (controlConversions > controlSize || variationConversions > variationSize) {
      return { conversionsSmallerThanSize: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.abTestForm.valid) {
      this.loading = true;
      this.calculationStarted.emit();

      const testData: AbTestInput = {
        control_size: this.abTestForm.value.control_size,
        control_conversions: this.abTestForm.value.control_conversions,
        variation_size: this.abTestForm.value.variation_size,
        variation_conversions: this.abTestForm.value.variation_conversions
      };

      this.abTestService.calculateResults(testData).subscribe({
        next: (results) => {
          this.loading = false;
          this.resultsCalculated.emit(results);
        },
        error: (error) => {
          this.loading = false;
          this.calculationError.emit(error.error?.error || 'An error occurred while calculating results.');
        }
      });
    }
  }
}