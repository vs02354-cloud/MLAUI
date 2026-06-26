import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './dashboard-main.html',
  styleUrls: ['./dashboard-main.scss']
})
export class DashboardMain {
  // Stats
  totalSurveys = 12500;
  totalVillages = 450;
  totalPanchayats = 120;
  totalAssemblies = 5;
  satisfactionPct = 78.5;
  dissatisfactionPct = 21.5;
  votingProb = 82.0;
  avgScore = 4.2;

  // Pie Chart (Satisfaction)
  pieChartOptions: ChartConfiguration['options'] = { responsive: true };
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['संतुष्ट', 'असंतुष्ट'],
    datasets: [{
      data: [78.5, 21.5],
      backgroundColor: ['#4caf50', '#f44336']
    }]
  };
  pieChartType: ChartType = 'pie';

  // Bar Chart (Development Score)
  barChartOptions: ChartConfiguration['options'] = { responsive: true };
  barChartData: ChartData<'bar'> = {
    labels: ['सड़क', 'बिजली', 'पेयजल', 'स्वास्थ्य', 'शिक्षा'],
    datasets: [
      { data: [4.5, 3.8, 4.0, 3.5, 4.2], label: 'औसत स्कोर (Avg Score)', backgroundColor: '#1976d2' }
    ]
  };
  barChartType: ChartType = 'bar';

  // Line Chart (Voting Trend)
  lineChartOptions: ChartConfiguration['options'] = { responsive: true };
  lineChartData: ChartData<'line'> = {
    labels: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई'],
    datasets: [
      { data: [70, 72, 75, 78, 82], label: 'वोट देने की संभावना (%)', borderColor: '#ff4081', tension: 0.4 }
    ]
  };
  lineChartType: ChartType = 'line';
}
