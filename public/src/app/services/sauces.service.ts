import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, of, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Sauce } from '../models/Sauce.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SaucesService {
  sauces$ = new Subject<Sauce[]>();
  private baseUrl = `${environment.apiUrl}/sauces`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    };
  }

  getSauces() {
    this.http
      .get<Sauce[]>(this.baseUrl, this.getAuthHeaders())
      .pipe(
        tap((sauces) => this.sauces$.next(sauces)),
        catchError((err) => {
          console.error(err.error?.message || err);
          return of([]);
        })
      )
      .subscribe();
  }

  getSauceById(id: string) {
    return this.http
      .get<Sauce>(`${this.baseUrl}/${id}`, this.getAuthHeaders())
      .pipe(catchError((err) => throwError(() => err.error?.message || err)));
  }

  likeSauce(id: string, like: boolean) {
    return this.http
      .post<{ message: string }>(
        `${this.baseUrl}/${id}/like`,
        {
          userId: this.auth.getUserId(),
          like: like ? 1 : 0,
        },
        this.getAuthHeaders()
      )
      .pipe(
        mapTo(like),
        catchError((err) => throwError(() => err.error?.message || err))
      );
  }

  dislikeSauce(id: string, dislike: boolean) {
    return this.http
      .post<{ message: string }>(
        `${this.baseUrl}/${id}/like`,
        {
          userId: this.auth.getUserId(),
          like: dislike ? -1 : 0,
        },
        this.getAuthHeaders()
      )
      .pipe(
        mapTo(dislike),
        catchError((err) => throwError(() => err.error?.message || err))
      );
  }

  createSauce(sauce: Sauce, image: File) {
    const formData = new FormData();
    formData.append('sauce', JSON.stringify(sauce));
    formData.append('image', image);
    return this.http
      .post<{ message: string }>(this.baseUrl, formData, this.getAuthHeaders())
      .pipe(catchError((err) => throwError(() => err.error?.message || err)));
  }

  modifySauce(id: string, sauce: Sauce, image: string | File) {
    const url = `${this.baseUrl}/${id}`;
    if (typeof image === 'string') {
      return this.http
        .put<{ message: string }>(url, sauce, this.getAuthHeaders())
        .pipe(catchError((err) => throwError(() => err.error?.message || err)));
    } else {
      const formData = new FormData();
      formData.append('sauce', JSON.stringify(sauce));
      formData.append('image', image);
      return this.http
        .put<{ message: string }>(url, formData, this.getAuthHeaders())
        .pipe(catchError((err) => throwError(() => err.error?.message || err)));
    }
  }

  deleteSauce(id: string) {
    return this.http
      .delete<{ message: string }>(
        `${this.baseUrl}/${id}`,
        this.getAuthHeaders()
      )
      .pipe(catchError((err) => throwError(() => err.error?.message || err)));
  }
}
