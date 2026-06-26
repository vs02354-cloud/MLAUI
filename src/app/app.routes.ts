import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.Login) },
    { path: 'survey', loadComponent: () => import('./survey/survey-form/survey-form').then(m => m.SurveyForm) },
    { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard-main/dashboard-main').then(m => m.DashboardMain) },
    { path: 'report-card', loadComponent: () => import('./report-card/mla-report/mla-report').then(m => m.MlaReport) },
    { path: '', redirectTo: '/survey', pathMatch: 'full' }
];
