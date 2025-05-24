import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken = '';
  private userId = '';

  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {
    // Restore session si token présent en localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      this.authToken = token;
      this.userId = userId;
      this.isAuth$.next(true);
    }
  }

  createUser(email: string, password: string) {
    return this.http.post<{ message: string }>(`${this.baseUrl}/signup`, {
      email,
      password,
    });
  }

  loginUser(email: string, password: string) {
    return this.http
      .post<{ userId: string; token: string }>(`${this.baseUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap(({ userId, token }) => {
          this.userId = userId;
          this.authToken = token;
          this.isAuth$.next(true);
          // ✅ Stocker token + userId
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
        })
      );
  }

  logout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  getToken() {
    return this.authToken;
  }

  getUserId() {
    return this.userId;
  }
}
