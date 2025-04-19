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

  // En dev : '/api/auth', via proxy.conf.json
  // En prod: 'https://piquante-production.up.railway.app/api/auth'
  private apiUrl = environment.production
    ? `${environment.apiUrl}/auth`
    : '/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Création d'utilisateur
  createUser(email: string, password: string) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/signup`, {
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

  // Déconnexion
  logout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    this.router.navigate(['login']);
  }
}
