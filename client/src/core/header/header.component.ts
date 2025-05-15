import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../auth/+store/auth.store';
import { ProfileSelectorDialogComponent } from '../auth/profile-selector-dialog/profile-selector-dialog.component';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})

export class HeaderComponent {
  private dialog = inject(MatDialog);
  private auth = inject(AuthStore);
  private router = inject(Router);
  readonly isLoggedIn = this.auth.isAuthenticated;
  readonly isHost = this.auth.isHost;
  readonly isBuyer = this.auth.isBuyer;

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

  logout() {
    this.auth.logout();
  }

  openProfileDialog() {
    this.dialog.open(ProfileSelectorDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      panelClass: 'profile-dialog',
      disableClose: true
    });
  }
}
