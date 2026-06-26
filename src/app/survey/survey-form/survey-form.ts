import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    MatProgressSpinnerModule
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

  isLoadingDistricts = false;
  isLoadingLocalBodies = false;
  isLoadingVillages = false;

  ratings = ['बहुत अच्छा', 'अच्छा', 'सामान्य', 'खराब', 'कार्य नहीं हुआ'];
  satisfactionLevels = ['बहुत संतुष्ट', 'संतुष्ट', 'सामान्य', 'असंतुष्ट', 'बहुत असंतुष्ट'];

  constructor(
    private fb: FormBuilder, 
    private masterDataService: MasterDataService,
    private surveyService: SurveyService
  ) {
    this.personalInfoForm = this.fb.group({
      surveyDate: [{ value: new Date().toLocaleDateString('hi-IN'), disabled: true }],
      district: ['', Validators.required],
      localBody: [{ value: '', disabled: true }, Validators.required],
      village: [{ value: '', disabled: true }, Validators.required],
      respondentName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      gender: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
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

  ngOnInit() {
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
        this.personalInfoForm.get('village')?.enable();
        this.isLoadingVillages = false;
      },
      error: () => this.isLoadingVillages = false
    });
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
