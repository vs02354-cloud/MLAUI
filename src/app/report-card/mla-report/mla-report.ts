import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-mla-report',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './mla-report.html',
  styleUrls: ['./mla-report.scss']
})
export class MlaReport {
  report = {
    mlaName: 'श्री रमेश शर्मा',
    assembly: 'विधानसभा क्षेत्र 1',
    totalSurveys: 2500,
    totalVillages: 45,
    satisfaction: 82.5,
    dissatisfaction: 17.5,
    votingProb: 85.0,
    devScore: 4.5,
    complaints: [
      'पेयजल की समस्या',
      'मुख्य सड़क की मरम्मत',
      'अस्पताल में डॉक्टरों की कमी'
    ],
    expectations: [
      'नए कॉलेज का निर्माण',
      'रोजगार के अवसर',
      'सिंचाई सुविधा'
    ],
    overallRating: 'A+',
    overallPerformance: 88.5
  };

  exportPdf() {
    alert('PDF Export Functionality will be integrated here.');
  }
}
