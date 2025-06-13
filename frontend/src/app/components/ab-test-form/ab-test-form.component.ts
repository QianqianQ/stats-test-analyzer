import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
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
                  min="1" 
                  [class.is-invalid]="abTestForm.get('control_size')?.invalid && abTestForm.get('control_size')?.touched">
                <div class="form-text">Total number of users in control group</div>
                <div *ngIf="abTestForm.get('control_size')?.invalid && abTestForm.get('control_size')?.touched" class="invalid-feedback">
                  Sample size must be at least 1
                </div>
              </div>
              <div class="mb-3">
                <label for="control-conversions" class="form-label">Conversions</label>
                <input 
                  type="number" 
                  id="control-conversions" 
                  formControlName="control_conversions" 
                  class="form-control" 
                  min="0"
                  [class.is-invalid]="abTestForm.get('control_conversions')?.invalid && abTestForm.get('control_conversions')?.touched">
                <div class="form-text">Number of users who converted</div>
                <div *ngIf="abTestForm.get('control_conversions')?.invalid && abTestForm.get('control_conversions')?.touched" class="invalid-feedback">
                  Conversions cannot exceed sample size
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
                  min="1"
                  [class.is-invalid]="abTestForm.get('variation_size')?.invalid && abTestForm.get('variation_size')?.touched">
                <div class="form-text">Total number of users in variation group</div>
                <div *ngIf="abTestForm.get('variation_size')?.invalid && abTestForm.get('variation_size')?.touched" class="invalid-feedback">
                  Sample size must be at least 1
                </div>
              </div>
              <div class="mb-3">
                <label for="variation-conversions" class="form-label">Conversions</label>
                <input 
                  type="number" 
                  id="variation-conversions" 
                  formControlName="variation_conversions" 
                  class="form-control" 
                  min="0"
                  [class.is-invalid]="abTestForm.get('variation_conversions')?.invalid && abTestForm.get('variation_conversions')?.touched">
                <div class="form-text">Number of users who converted</div>
                <div *ngIf="abTestForm.get('variation_conversions')?.invalid && abTestForm.get('variation_conversions')?.touched" class="invalid-feedback">
                  Conversions cannot exceed sample size
                </div>
              </div>
            </div>
          </div>
          
          <div class="d-grid">
            <button 
              type="submit" 
              class="btn btn-primary btn-lg" 
              [disabled]="loading || abTestForm.invalid">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i *ngIf="!loading" class="fas fa-calculator me-2"></i>
              {{ loading ? 'Calculating...' : 'Calculate Statistical Significance' }}
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
      control_size: [1000, [Validators.required, Validators.min(1)]],
      control_conversions: [100, [Validators.required, Validators.min(0)]],
      variation_size: [1000, [Validators.required, Validators.min(1)]],
      variation_conversions: [120, [Validators.required, Validators.min(0)]]
    }, { validators: this.conversionsSmallerThanSizeValidator });
  }

  conversionsSmallerThanSizeValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const controlSize = form.get('control_size')?.value;
    const controlConversions = form.get('control_conversions')?.value;
    const variationSize = form.get('variation_size')?.value;
    const variationConversions = form.get('variation_conversions')?.value;

    if (controlConversions > controlSize || variationConversions > variationSize) {
      return { 'conversionsExceedSize': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.abTestForm.valid && !this.loading) {
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
          let errorMessage = 'An error occurred while calculating results.';
          if (error.error && error.error.error) {
            errorMessage = error.error.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          this.calculationError.emit(errorMessage);
        }
      });
    }
  }
}