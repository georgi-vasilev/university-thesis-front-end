import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { ProfileSelectorDialogComponent } from '../auth/profile-selector-dialog/profile-selector-dialog.component';
import { AuthStore } from '../auth/+store/auth.store';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})

export class HeaderComponent {
  private dialog = inject(MatDialog);
  private auth = inject(AuthStore);
  readonly isLoggedIn = this.auth.isAuthenticated;

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
