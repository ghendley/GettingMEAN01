import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Location} from './home-list/home-list.component';

@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {

  constructor(private http: HttpClient) {
  }

  public getLocations(): Promise<Location[]> {
    const lng: number = -96.29157257080078;
    const lat: number = 30.647083282470703;
    const maxDistance: number = 20000;
    // TODO DO NOT HARD CODE URL HERE
    const url: string = `http://localhost:3000/api/locations?lng=${lng}&lat=${lat}&maxkm=${maxDistance}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Location[])
      .catch(Loc8rDataService.handleError);
  }

  private static handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }
}
