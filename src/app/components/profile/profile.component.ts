import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UpdateProfileDTO } from 'src/app/models/User/UpdateProfileDTO';
import { AuthService } from 'src/app/services/auth.service';

type AlertType = 'success' | 'info' | 'warning' | 'error';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  public profile: UpdateProfileDTO = {
    fullName: localStorage.getItem('fullName') ?? '',
    email: localStorage.getItem('email') ?? '',
    verificationCode: '',
    currentPassword: '',
    newPassword: null,
  };
  isExternalUser: boolean = false;
  confirmPassword = '';
  alertMessage = '';
  alertType: AlertType = 'success';
  alertVisible = false;
  loading = false;
  currentStep = 1;
  showPasswordChange = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private _notification: NzNotificationService
  ) {
    this.isExternalUser = localStorage.getItem('external') === 'true';
  }

  togglePasswordChange(): void {
    this.showPasswordChange = !this.showPasswordChange;
  }

  onSubmit(): void {
    this.alertVisible = false;
    if (
      this.showPasswordChange &&
      (!this.profile.currentPassword || !this.profile.newPassword)
    ) {
      this.alertType = 'error';
      this.alertMessage = 'Current and new passwords are required';
      this.alertVisible = true;
      return;
    }
    if (
      this.showPasswordChange &&
      this.profile.newPassword !== this.confirmPassword
    ) {
      this.alertType = 'error';
      this.alertMessage = 'New passwords do not match';
      this.alertVisible = true;
      return;
    }
    this.loading = true;
    this.authService.sendVerificationCode().subscribe(
      (res) => {
        if (res.data) {
          this.loading = false;
          this.currentStep = 2;
        } else {
          this.alertMessage = res.data.message;
          this.alertType = 'error';
          this.alertVisible = true;
          this.loading = false;
        }
      },
      (err: any) => {
        this.alertMessage = err.error.message;
        this.alertVisible = true;
        this.alertType = 'error';
        this.loading = false;
      }
    );
  }

  onConfirm(): void {
    this.alertVisible = false;
    this.loading = true;
    this.authService.updateProfile(this.profile).subscribe(
      (res) => {
        this.currentStep = 1;
        this._notification.create(
          'success',
          'Profile',
          'Your profile has been updated successfully!'
        );
        this.router.navigateByUrl('/').then(() => {
          window.location.reload();
        });
      },
      (err: any) => {
        this._notification.create('error', 'Verification', err.error.message);
        this.loading = false;
      }
    );
  }
}
