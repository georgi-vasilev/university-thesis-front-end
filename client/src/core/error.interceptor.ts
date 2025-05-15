import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStore } from './auth/+store/auth.store';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private snackBar = inject(MatSnackBar);
  private auth = inject(AuthStore);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let message = 'An error occurred';

        if (err.status === 0) {
          message = 'Unable to connect to the server.';
        } else if (err.status === 401) {
          message = 'Unauthorized. Please log in again.';
          this.auth.logout(); // optionally log out on 401
        } else if (err.status === 403) {
          message = 'You are not allowed to perform this action.';
        } else if (err.status === 404) {
          message = 'Resource not found.';
        } else if (err.status >= 500) {
          message = 'A server error occurred.';
        } else if (err.error && typeof err.error === 'string') {
          message = err.error;
        }

        this.snackBar.open(message, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar'],
        });

        return throwError(() => err);
      })
    );
  }
}

