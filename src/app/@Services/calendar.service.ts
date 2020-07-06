import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {WeekElement} from '../@Models/calendar.model';
import {PatientMedicationService} from './patient-medication.service';
import {PatientInvestigationService} from './patient-investigation.service';
import {PatientService} from './patient.service';
import {filter, take, tap} from 'rxjs/operators';
import {PatientRecruitment} from '../@Models/recruitment.model';
import {PatientRecruitmentService} from './patient-recruitment.service';
import {PatientSymptomService} from './patient-symptom.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {

  constructor(
    private http: HttpClient,
    private readonly patientMedicationService: PatientMedicationService,
    private readonly patientInvestigationService: PatientInvestigationService,
    private readonly patientService: PatientService,
    private readonly patientRecruitmentService: PatientRecruitmentService,
    private readonly patientSymptomService: PatientSymptomService,
  ) {
  }

  private _calendar: WeekElement[] = [];
  public calendar$: BehaviorSubject<WeekElement[]> = new BehaviorSubject<WeekElement[]>([]);

  generateCalendarFromDate(date: Date): void {
    let tmpDate = new Date();
    const limiter = {
      from: new Date(tmpDate.setDate(date.getDate() - 15)),
      to: new Date(tmpDate.setDate(date.getDate() + 28)),
    };
    tmpDate = limiter.from;
    const result: WeekElement[] = [];
    for (let i = 0; i < 31; i++) {
      const week: WeekElement = {active: (i === 2), days: []};
      for (let a = 0; a < 7; a++) {
        week.days.push({
          date: new Date(tmpDate.setDate(tmpDate.getDate() + 1)),
          events: [],
          active: (date.getDate() === tmpDate.getDate()),
        });
      }
      result.push(week);
    }
    this._calendar = result;
    this.calendar$.next(this._calendar);
  }

  linkPatientData(date: Date) {
    forkJoin([this.patientMedicationService.ready$.pipe(filter(s => !!s), take(1)),
      this.patientInvestigationService.ready$.pipe(filter(s => !!s), take(1)),
      this.patientRecruitmentService.ready$.pipe(filter(s => !!s), take(1)),
      this.patientSymptomService.ready$.pipe(filter(s => !!s), take(1)),
    ]).subscribe((a) => {
      this.linkMedicationsToCalendar(date);
      this.linkInvestigationsToCalendar(date);
      this.linkRecruitmentsToCalendar(date);
      this.linkSymptomToCalendar(date);
    });
    this.patientSymptomService.symptomChange$.subscribe(() => {
      this.linkSymptomToCalendar(new Date());
    });
  }

  linkMedicationsToCalendar(date: Date) {
    for (const week of this._calendar) {
      for (const day of week.days) {
        this.patientMedicationService.findMedicationsForDate(day.date).subscribe((event) => {
          if (event) {
            day.events.push(event);
          }
        });
      }
    }
    this.calendar$.next(this._calendar);
  }

  linkInvestigationsToCalendar(date: Date) {
    for (const week of this._calendar) {
      for (const day of week.days) {
        this.patientInvestigationService.findInvestigationsForDate(day.date).subscribe((event) => {
          if (event) {
            day.events.push(...event);
          }
        });
      }
    }
    this.calendar$.next(this._calendar);
  }

  linkRecruitmentsToCalendar(date: Date) {
    for (const week of this._calendar) {
      for (const day of week.days) {
        this.patientRecruitmentService.findInvestigationsForDate(day.date).subscribe((event) => {
          if (event) {
            day.events.push(event);
          }
        });
      }
    }
    this.calendar$.next(this._calendar);
  }

  linkSymptomToCalendar(date: Date) {
    for (const week of this._calendar) {
      for (const day of week.days) {
        this.patientSymptomService.findSymptomsForDate(day.date).subscribe((event) => {
          if (event) {
            const s = day.events.find((i) => {
              return i.typeName === 'symptom';
            });
            if (s) {
              s.text = event.text;
            } else {
              day.events.push(event);
            }
          }
        });
      }
    }
    this.calendar$.next(this._calendar);
  }

}
