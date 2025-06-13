import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbTestInput, AbTestResults } from '../models/ab-test.model';

@Injectable({
  providedIn: 'root'
})
export class AbTestService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  calculateResults(input: AbTestInput): Observable<AbTestResults> {
    return this.http.post<AbTestResults>(`${this.apiUrl}/calculate`, input);
  }
}