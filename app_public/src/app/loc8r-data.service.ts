import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Location} from './home-list/home-list.component';
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {

  constructor(private http: HttpClient) {
  }

  private static handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  public getLocations(): Promise<Location[]> {
    const lng: number = -96.29157257080078;
    const lat: number = 30.647083282470703;
    const maxDistance: number = 20000;
    const apiUrl: string = environment["API_URI"];

    const url: string = `${apiUrl}/locations?lng=${lng}&lat=${lat}&maxkm=${maxDistance}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Location[])
      .catch(Loc8rDataService.handleError);
  }
}
