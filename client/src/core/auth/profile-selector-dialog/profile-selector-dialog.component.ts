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
import { Buyer } from '../models/buyer.model';
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
  step = signal<'select' | 'buyer' | 'host' | 'login'>('select');
  dialogRef = inject(MatDialogRef<ProfileSelectorDialogComponent>);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  authStore = inject(AuthStore);

  readonly loginError = signal<string | null>(null);
  readonly loading = signal(false);
  readonly submittedHost = signal<Host | null>(null);
  readonly submittedBuyer = signal<Buyer | null>(null);
  readonly result = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  // Host registration form
  readonly hostForm = this.fb.group({
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

  readonly buyerForm = this.fb.group({
    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ],
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const host = this.submittedHost();
      if (!host) return;

      this.authService.registerHost(host).subscribe({
        next: (token) => {
          this.authStore.login(token);
          this.dialogRef.close();
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Host registration failed', err);
          this.error.set('Host registration failed');
          this.loading.set(false);
        }
      });
    });

    effect(() => {
      const buyer = this.submittedBuyer();
      if (!buyer) return;

      this.authService.registerBuyer(buyer).subscribe({
        next: (token) => {
          this.authStore.login(token);
          this.dialogRef.close();
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Buyer registration failed', err);
          this.error.set('Buyer registration failed');
          this.loading.set(false);
        }
      });
    });
  }

  submitHostForm() {
    if (this.hostForm.invalid) {
      this.hostForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const host = this.hostForm.value as Host;
    this.submittedHost.set(host);
  }

  submitBuyerForm() {
    if (this.buyerForm.invalid) {
      this.buyerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const buyer = this.buyerForm.value as Buyer;
    this.submittedBuyer.set(buyer);
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

  choose(mode: 'buyer' | 'host') {
    this.step.set(mode);
  }

  close() {
    this.dialogRef.close();
  }
}
