import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface SubmitSurveyPayload {
  districtId: number;
  localBodyId: number;
  villageId: number;
  respondentName: string;
  age: number;
  gender: string;
  mobileNumber: string;

  developmentWorks: string;
  road: string;
  electricity: string;
  water: string;
  health: string;
  education: string;
  govtSchemes: string;

  satisfaction: string;
  willVote: string;
  biggestProblem: string;
  expectation: string;
  suggestion: string;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private apiUrl = 'http://localhost:5023/api/Survey';

  constructor(private http: HttpClient) { }

  submitSurvey(data: SubmitSurveyPayload): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
