import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Otp} from '../@Models/otp.model';
import {Patient} from '../@Models/patient';
import {map} from 'rxjs/operators';
import {PatientMedication} from '../@Models/medication.model';
import {PatientInvestigation} from '../@Models/investigation.model';
import {PatientRecruitment} from '../@Models/recruitment.model';

@Injectable()
export class RequestService {
  constructor(private readonly http: HttpClient) {
  }

  generateOtp(phoneNumber: string): Observable<Otp> {
    return this.http.post<Otp>(`${environment.apiRootUrl}/otps/`, {phoneNumber});
  }

  confirmOtp(phoneNumber: string, code: string): Observable<Otp> {
    return this.http.put<Otp>(`${environment.apiRootUrl}/otps/${code}/confirm`, {phoneNumber});
  }

  getPatientByPhone(phoneNumber: string): Observable<Patient> {
    return this.http.get<Patient[]>(`${environment.apiRootUrl}/patients/?MobileNo=${phoneNumber}`).pipe(map((patients: Patient[]) => {
      return patients[0];
    }));
  }

  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${environment.apiRootUrl}/patients/${id}`);
  }

  getPatientMedications(id: string): Observable<PatientMedication[]> {
    return this.http.get<PatientMedication[]>(`${environment.apiRootUrl}/patients/${id}/medications`);
  }

  getPatientRecruitment(id: string): Observable<PatientRecruitment[]> {
    return this.http.get<PatientRecruitment[]>(`${environment.apiRootUrl}/patients/${id}/recruitments`);
  }

  getPatientInvestigations(id: string): Observable<PatientInvestigation[]> {
    return this.http.get<PatientInvestigation[]>(`${environment.apiRootUrl}/patients/${id}/investigations`);
  }

  updatePatient(body: Partial<Patient>, id: number): Observable<Patient> {
    return this.http.put<Patient>(`${environment.apiRootUrl}/patients/${id}`, body);
  }
}
