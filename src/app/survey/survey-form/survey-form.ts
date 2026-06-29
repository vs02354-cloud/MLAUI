import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MasterDataService, District, LocalBody, Village } from '../../core/services/master-data.service';
import { SurveyService, SubmitSurveyPayload } from '../../core/services/survey.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-survey-info-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title class="premium-title" style="color: #1976d2; margin-bottom: 10px; font-weight: 600;">महत्वपूर्ण सूचना</h2>
    <mat-dialog-content style="font-size: 1.1rem; line-height: 1.6; text-align: justify; margin-bottom: 10px;">
      उत्तरदाता की जानकारी पूर्णतः गोपनीय रखी जाएगी तथा किसी भी प्रकार से सार्वजनिक नहीं की जाएगी। यह सर्वे केवल पिछले 5 वर्षों में किए गए विकास कार्यों एवं उनके प्रभाव का निष्पक्ष आकलन और प्रगति प्रदर्शित करने के उद्देश्य से किया जा रहा है।
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" mat-dialog-close>मैं सहमत हूँ (I Agree)</button>
    </mat-dialog-actions>
  `
})
export class SurveyInfoDialog {}

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './survey-form.html',
  styleUrls: ['./survey-form.scss']
})
export class SurveyForm implements OnInit {
  personalInfoForm: FormGroup;
  surveyForm: FormGroup;
  feedbackForm: FormGroup;

  districts: District[] = [];
  localBodies: LocalBody[] = [];
  villages: Village[] = [];

  filteredDistricts: District[] = [];
  filteredLocalBodies: LocalBody[] = [];
  filteredVillages: Village[] = [];

  isLoadingDistricts = false;
  isLoadingLocalBodies = false;
  isLoadingVillages = false;

  ratings = ['बहुत अच्छा', 'अच्छा', 'सामान्य', 'खराब', 'कार्य नहीं हुआ'];
  satisfactionLevels = ['बहुत संतुष्ट', 'संतुष्ट', 'सामान्य', 'असंतुष्ट', 'बहुत असंतुष्ट'];

  constructor(
    private fb: FormBuilder, 
    private masterDataService: MasterDataService,
    private surveyService: SurveyService,
    private dialog: MatDialog
  ) {
    this.personalInfoForm = this.fb.group({
      surveyDate: [{ value: new Date().toLocaleDateString('hi-IN'), disabled: true }],
      district: ['', Validators.required],
      localBody: [{ value: '', disabled: true }, Validators.required],
      village: [{ value: '', disabled: true }, Validators.required],
      respondentName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      gender: ['', Validators.required],
      mobile: ['', 
        [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')],
        [this.uniqueMobileValidator()]
      ]
    });

    this.surveyForm = this.fb.group({
      developmentWorks: ['', Validators.required],
      road: ['', Validators.required],
      electricity: ['', Validators.required],
      water: ['', Validators.required],
      health: ['', Validators.required],
      education: ['', Validators.required],
      govtSchemes: ['', Validators.required]
    });

    this.feedbackForm = this.fb.group({
      satisfaction: ['', Validators.required],
      willVote: ['', Validators.required],
      biggestProblem: ['', Validators.required],
      expectation: [''],
      suggestion: ['']
    });
  }

  uniqueMobileValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value.length !== 10) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() => this.surveyService.checkMobileUniqueness(control.value)),
        map(res => (res.isRegistered ? { notUnique: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  ngOnInit() {
    this.dialog.open(SurveyInfoDialog, {
      width: '500px',
      disableClose: true,
      autoFocus: false
    });

    this.loadDistricts();

    this.personalInfoForm.get('district')?.valueChanges.subscribe(districtId => {
      this.personalInfoForm.get('localBody')?.reset();
      this.personalInfoForm.get('localBody')?.disable();
      this.personalInfoForm.get('village')?.reset();
      this.personalInfoForm.get('village')?.disable();
      this.localBodies = [];
      this.villages = [];

      if (districtId) {
        this.loadLocalBodies(districtId);
      }
    });

    this.personalInfoForm.get('localBody')?.valueChanges.subscribe(localBodyId => {
      this.personalInfoForm.get('village')?.reset();
      this.personalInfoForm.get('village')?.disable();
      this.villages = [];

      if (localBodyId) {
        this.loadVillages(localBodyId);
      }
    });
  }

  loadDistricts() {
    this.isLoadingDistricts = true;
    this.masterDataService.getDistricts().subscribe({
      next: (data) => {
        this.districts = data;
        this.filteredDistricts = data;
        this.isLoadingDistricts = false;
      },
      error: () => this.isLoadingDistricts = false
    });
  }

  loadLocalBodies(districtId: number) {
    this.isLoadingLocalBodies = true;
    this.masterDataService.getLocalBodies(districtId).subscribe({
      next: (data) => {
        this.localBodies = data;
        this.filteredLocalBodies = data;
        this.personalInfoForm.get('localBody')?.enable();
        this.isLoadingLocalBodies = false;
      },
      error: () => this.isLoadingLocalBodies = false
    });
  }

  loadVillages(localBodyId: number) {
    this.isLoadingVillages = true;
    this.masterDataService.getVillages(localBodyId).subscribe({
      next: (data) => {
        this.villages = data;
        this.filteredVillages = data;
        this.personalInfoForm.get('village')?.enable();
        this.isLoadingVillages = false;
      },
      error: () => this.isLoadingVillages = false
    });
  }
  filterDistricts(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDistricts = this.districts.filter(d => 
      d.nameHi.toLowerCase().includes(searchTerm) || d.nameEn.toLowerCase().includes(searchTerm)
    );
  }

  filterLocalBodies(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredLocalBodies = this.localBodies.filter(l => 
      l.nameHi.toLowerCase().includes(searchTerm) || l.nameEn.toLowerCase().includes(searchTerm)
    );
  }

  filterVillages(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredVillages = this.villages.filter(v => 
      v.nameHi.toLowerCase().includes(searchTerm) || v.nameEn.toLowerCase().includes(searchTerm)
    );
  }

  submitSurvey() {
    if (this.personalInfoForm.valid && this.surveyForm.valid && this.feedbackForm.valid) {
      const personalData = this.personalInfoForm.getRawValue();
      const surveyData = this.surveyForm.value;
      const feedbackData = this.feedbackForm.value;

      const payload: SubmitSurveyPayload = {
        districtId: personalData.district,
        localBodyId: personalData.localBody,
        villageId: personalData.village,
        respondentName: personalData.respondentName,
        age: personalData.age,
        gender: personalData.gender,
        mobileNumber: personalData.mobile,
        
        developmentWorks: surveyData.developmentWorks,
        road: surveyData.road,
        electricity: surveyData.electricity,
        water: surveyData.water,
        health: surveyData.health,
        education: surveyData.education,
        govtSchemes: surveyData.govtSchemes,
        
        satisfaction: feedbackData.satisfaction,
        willVote: feedbackData.willVote,
        biggestProblem: feedbackData.biggestProblem,
        expectation: feedbackData.expectation || '',
        suggestion: feedbackData.suggestion || ''
      };

      this.surveyService.submitSurvey(payload).subscribe({
        next: (res) => {
          alert('आपका उत्तर सफलतापूर्वक सेव कर दिया गया है।');
          window.location.reload();
        },
        error: (err) => {
          console.error(err);
          const errorMessage = err.error?.message || 'सर्वे सबमिट करते समय त्रुटि हुई!';
          alert(errorMessage);
        }
      });
    } else {
      alert('कृपया सभी आवश्यक फ़ील्ड भरें।');
    }
  }

  onMobileInput(event: any) {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    this.personalInfoForm.get('mobile')?.setValue(value, { emitEvent: false });
    event.target.value = value;
  }
}
