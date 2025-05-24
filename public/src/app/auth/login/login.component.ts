import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading!: boolean;
  errorMsg!: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  onLogin() {
    this.loading = true;
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;
    this.auth
      .loginUser(email, password)
      .pipe(
        tap(() => {
          this.loading = false;
          this.router.navigate(['/sauces']);
        }),
        catchError((error) => {
          this.loading = false;
          this.errorMsg = this.getFriendlyError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private getFriendlyError(error: any): string {
    const msg =
      error.error?.error || error.error?.message || 'Une erreur est survenue.';

    if (msg.includes('Identifiants incorrects'))
      return 'Email ou mot de passe incorrect.';

    return msg;
  }
}
