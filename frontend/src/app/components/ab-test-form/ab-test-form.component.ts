import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbTestService } from '../../services/ab-test.service';
import { AbTestInput, AbTestResults } from '../../models/ab-test.model';

@Component({
  selector: 'app-ab-test-form',
  templateUrl: './ab-test-form.component.html',
  styleUrls: ['./ab-test-form.component.scss']
})
export class AbTestFormComponent {
  @Output() calculationStarted = new EventEmitter<void>();
  @Output() resultsCalculated = new EventEmitter<AbTestResults>();
  @Output() calculationError = new EventEmitter<string>();

  abTestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private abTestService: AbTestService
  ) {
    this.abTestForm = this.fb.group({
      controlSize: [1000, [Validators.required, Validators.min(1)]],
      controlConversions: [150, [Validators.required, Validators.min(0)]],
      variationSize: [1000, [Validators.required, Validators.min(1)]],
      variationConversions: [180, [Validators.required, Validators.min(0)]]
    }, { 
      validators: this.conversionsSmallerThanSizeValidator 
    });
  }

  // Custom validator to ensure conversions are not larger than sample size
  conversionsSmallerThanSizeValidator(form: FormGroup): { [key: string]: boolean } | null {
    const controlSize = form.get('controlSize')?.value;
    const controlConversions = form.get('controlConversions')?.value;
    const variationSize = form.get('variationSize')?.value;
    const variationConversions = form.get('variationConversions')?.value;
    
    const errors: { [key: string]: boolean } = {};
    
    if (controlConversions > controlSize) {
      errors['controlConversionsTooLarge'] = true;
    }
    
    if (variationConversions > variationSize) {
      errors['variationConversionsTooLarge'] = true;
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }

  onSubmit(): void {
    if (this.abTestForm.invalid) {
      return;
    }

    this.calculationStarted.emit();

    const formValues = this.abTestForm.value;
    
    const testData: AbTestInput = {
      control_size: formValues.controlSize,
      control_conversions: formValues.controlConversions,
      variation_size: formValues.variationSize,
      variation_conversions: formValues.variationConversions
    };

    this.abTestService.calculateResults(testData).subscribe({
      next: (results) => {
        this.resultsCalculated.emit(results);
      },
      error: (error) => {
        console.error('Error calculating results:', error);
        let errorMessage = 'An error occurred during calculation';
        
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        
        this.calculationError.emit(errorMessage);
      }
    });
  }
}