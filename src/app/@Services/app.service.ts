import {Injectable} from '@angular/core';
import {ServiceWorkerService} from './service-worker.service';
import {filter, mergeMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RequestService} from './request.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private readonly swService: ServiceWorkerService,
              private requestService: RequestService) {
  }

  reset() {
    // This function remove every type of data
    localStorage.clear();
    window.location.reload();
  }

  async logout() {
    // This function doesn't remove the cached data (like blood pressure)
    localStorage.clear();
    await this.clearCache().toPromise();
    const keys = await caches.keys()
    for (const key of keys) {
      await caches.delete(key);
    }
    this.swService.serviceWorkerRegistration$.getValue().unregister();
  }

  clearCache(): Observable<void> {
    return this.swService.backgroundSyncReady$.pipe(filter(s => !!s), mergeMap(() => {
      navigator.serviceWorker.controller.postMessage({
        command: 'clear',
        message: ''
      });
      return new Observable<void>(sub => {
        navigator.serviceWorker.addEventListener('message', function handler(event) {
          navigator.serviceWorker.removeEventListener('message', handler);
          sub.complete();
        });
      });
    }));
  }
}
