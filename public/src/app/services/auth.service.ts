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

  // baseUrl est toujours "/api/auth"
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  // Création d'utilisateur
  createUser(email: string, password: string) {
    return this.http.post<{ message: string }>(`${this.baseUrl}/signup`, {
      email,
      password,
    });
  }

  // Récupérer le token en mémoire
  getToken() {
    return this.authToken;
  }

  // Récupérer l'ID utilisateur
  getUserId() {
    return this.userId;
  }

  // Connexion utilisateur
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
        })
      );
  }

  // Déconnexion
  logout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    this.router.navigate(['login']);
  }
}
