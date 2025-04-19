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
  // Sujets pour émettre la liste de sauces
  sauces$ = new Subject<Sauce[]>();

  // Base URL qui passe par proxy en dev, ou pointe direct en prod
  private baseUrl = environment.production
    ? `${environment.apiUrl}/sauces`
    : '/api/sauces';

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Récupérer toutes les sauces
  getSauces() {
    this.http
      .get<Sauce[]>(this.baseUrl)
      .pipe(
        tap((sauces) => this.sauces$.next(sauces)),
        catchError((err) => {
          console.error(err.error?.message || err);
          return of([]);
        })
      )
      .subscribe();
  }

  // Récupérer une sauce par ID
  getSauceById(id: string) {
    return this.http
      .get<Sauce>(`${this.baseUrl}/${id}`)
      .pipe(catchError((err) => throwError(err.error?.message || err)));
  }

  // Liker une sauce
  likeSauce(id: string, like: boolean) {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/${id}/like`, {
        userId: this.auth.getUserId(),
        like: like ? 1 : 0,
      })
      .pipe(
        mapTo(like),
        catchError((err) => throwError(err.error?.message || err))
      );
  }

  // Disliker une sauce (utilise le même endpoint)
  dislikeSauce(id: string, dislike: boolean) {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/${id}/like`, {
        userId: this.auth.getUserId(),
        like: dislike ? -1 : 0,
      })
      .pipe(
        mapTo(dislike),
        catchError((err) => throwError(err.error?.message || err))
      );
  }

  // Créer une sauce (multipart/form-data)
  createSauce(sauce: Sauce, image: File) {
    const formData = new FormData();
    formData.append('sauce', JSON.stringify(sauce));
    formData.append('image', image);
    return this.http
      .post<{ message: string }>(this.baseUrl, formData)
      .pipe(catchError((err) => throwError(err.error?.message || err)));
  }

  // Modifier une sauce (avec ou sans nouvelle image)
  modifySauce(id: string, sauce: Sauce, image: string | File) {
    const url = `${this.baseUrl}/${id}`;
    if (typeof image === 'string') {
      return this.http
        .put<{ message: string }>(url, sauce)
        .pipe(catchError((err) => throwError(err.error?.message || err)));
    } else {
      const formData = new FormData();
      formData.append('sauce', JSON.stringify(sauce));
      formData.append('image', image);
      return this.http
        .put<{ message: string }>(url, formData)
        .pipe(catchError((err) => throwError(err.error?.message || err)));
    }
  }

  // Supprimer une sauce
  deleteSauce(id: string) {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/${id}`)
      .pipe(catchError((err) => throwError(err.error?.message || err)));
  }
}
