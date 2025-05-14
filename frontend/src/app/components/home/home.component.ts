import { Component } from '@angular/core';
import { AbTestResults } from '../../models/ab-test.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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
  }

  onCalculationError(errorMessage: string): void {
    this.error = errorMessage;
    this.loading = false;
  }
}