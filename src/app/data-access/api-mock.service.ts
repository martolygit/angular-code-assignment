import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { pollsList } from './polls-mock.data';
import { pollCategories } from './categories-mock.data';
import { CategoryMeta, Poll, PollCategory } from './types';
import { HttpClient } from '@angular/common/http';

const randomDelay = (maxMs: number) => Math.random() * maxMs;

@Injectable({
  providedIn: 'root',
})
export class ApiMockService {
  constructor(private http: HttpClient) {}

  getPolls(): Observable<Poll[]> {
    return of(pollsList).pipe(delay(randomDelay(5000)));
  }

  getCategories(): Observable<PollCategory[]> {
    return of(pollCategories).pipe(delay(randomDelay(5000)));
  }

  getCategoriesMeta(): Observable<CategoryMeta[]> {
    return this.http.get<CategoryMeta[]>(
      'https://minio.ag.mos.ru/ag-main/data/poll-categories.json'
    );
  }
}
