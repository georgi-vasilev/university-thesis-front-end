import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private token = signal<string | null>(localStorage.getItem('token'));

  readonly user = computed(() => {
    const token = this.token();
    return token ? this.decodeToken(token) : null;
  });

  readonly isTokenExpired = computed(() => {
    const user = this.user();
    if (!user?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return user.exp < now;
  });

  readonly isAuthenticated = computed(() => !!this.token());

  constructor() {
    if (this.isTokenExpired()) {
      this.logout();
    }
  }

  getToken() {
    return this.token();
  }

  login(token: string) {
    localStorage.setItem('token', token);
    this.token.set(token);
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

}

