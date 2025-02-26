import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod'; // Import de l'URL d'API

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken = '';
  private userId = '';
  private apiUrl = environment.apiUrl + '/auth'; // Utilisation de l'URL d'API

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/signup`, {
      email,
      password,
    }); // ✅ Adaptation
  }

  getToken() {
    return this.authToken;
  }

  getUserId() {
    return this.userId;
  }

  loginUser(email: string, password: string) {
    return this.http
      .post<{ userId: string; token: string }>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap(({ userId, token }) => {
          this.userId = userId;
          this.authToken = token;
          this.isAuth$.next(true);
        })
      );
  }

  logout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    this.router.navigate(['login']);
  }
}
