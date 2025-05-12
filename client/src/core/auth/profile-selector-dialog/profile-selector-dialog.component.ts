import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../models/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Host } from '../models/host.model';
import { effect } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { phoneNumberValidator } from '../validators/phone-number.validator';
import { IUserLogin } from '../models/user-login.model';
import { AuthStore } from '../+store/auth.store';

@Component({
  standalone: true,
  selector: 'app-profile-selector-dialog',
  templateUrl: './profile-selector-dialog.component.html',
  styleUrls: ['./profile-selector-dialog.component.scss'],
  imports: [
    MatProgressSpinnerModule,
    MatError,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class ProfileSelectorDialogComponent {
  step = signal<'select' | 'user' | 'host' | 'login'>('select');
  dialogRef = inject(MatDialogRef<ProfileSelectorDialogComponent>);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  authStore = inject(AuthStore)

  readonly loginError = signal<string | null>(null);
  readonly loading = signal(false);
  readonly submitted = signal<Host | null>(null);
  readonly result = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly form = this.fb.group({
    username: ['', Validators.required],
    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ],
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ],
    ],
    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(12),
        phoneNumberValidator()
      ],
    ],
    instagramHandler: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],
    password: ['', Validators.required]
  });

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });


  constructor() {
    effect(() => {
      const host = this.submitted();
      if (!host) return;

      this.authService.registerHost(host).subscribe({
        next: (token) => {
          this.authStore.login(token);
          this.dialogRef.close();
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Registration failed', err);
          this.error.set('Registration failed');
          this.loading.set(false);
        }
      });
    });
  }

  submitHostForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    if (this.form.invalid) return;

    const host = this.form.value as Host;
    this.submitted.set(host);
  }

  submitLoginForm() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const credentials = this.loginForm.value as IUserLogin;

    this.authService.login(credentials).subscribe({
      next: (token) => {
        this.authStore.login(token);
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.loading.set(false);
        this.loginError.set('Invalid credentials. Please try again.');
      }
    });
  }



  choose(mode: 'user' | 'host') {
    this.step.set(mode);
  }

  close() {
    this.dialogRef.close();
  }
}

