import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading!: boolean;
  errorMsg!: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  onSignup() {
    this.loading = true;
    const email = this.signupForm.get('email')!.value;
    const password = this.signupForm.get('password')!.value;
    this.auth
      .createUser(email, password)
      .pipe(
        switchMap(() => this.auth.loginUser(email, password)),
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

    if (msg.includes('email valide'))
      return 'Veuillez entrer une adresse email valide.';
    if (msg.includes("mot de passe n'est pas assez fort")) {
      return 'Le mot de passe doit contenir entre 8 et 32 caractères, avec au moins 1 majuscule, 1 minuscule, 1 chiffre, sans espace.';
    }

    return msg;
  }
}
