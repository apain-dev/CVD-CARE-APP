import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {registerLocaleData} from '@angular/common';
import localeENUS from '@angular/common/locales/en';
import localeFR from '@angular/common/locales/fr';
import {ServiceWorkerService} from './@Services/service-worker.service';
import {OverlayService} from './@Services/overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'mhealth';

  constructor(
    private translateService: TranslateService,
    private readonly swService: ServiceWorkerService,
    private readonly overlayService: OverlayService,
  ) {
    console.info('300');
    registerLocaleData(localeENUS, 'en-US');
    registerLocaleData(localeENUS, 'kn-IN');
    registerLocaleData(localeFR, 'fr-FR');
    if (localStorage.getItem('favoriteLang')) {
      this.translateService.use((localStorage.getItem('favoriteLang')));
      this.translateService.setDefaultLang((localStorage.getItem('favoriteLang')));
    } else {
      this.translateService.setDefaultLang('en-US');
    }
  }

  public ngOnInit(): void {
    this.swService.registerBackgroundSync().then(() => {
    }, err => {
      console.error(err);
    });
  }
}
