import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface District {
  id: number;
  nameEn: string;
  nameHi: string;
}

export interface LocalBody {
  id: number;
  districtId: number;
  nameEn: string;
  nameHi: string;
}

export interface Village {
  id: number;
  localBodyId: number;
  nameEn: string;
  nameHi: string;
}

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private apiUrl = 'http://192.168.29.66:5023/api/MsrMasterData';

  constructor(private http: HttpClient) { }

  getDistricts(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiUrl}/districts`);
  }

  getLocalBodies(districtId: number): Observable<LocalBody[]> {
    return this.http.get<LocalBody[]>(`${this.apiUrl}/localbodies/${districtId}`);
  }

  getVillages(localBodyId: number): Observable<Village[]> {
    return this.http.get<Village[]>(`${this.apiUrl}/villages/${localBodyId}`);
  }
}
