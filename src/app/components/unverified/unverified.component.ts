import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-unverified',
  templateUrl: './unverified.component.html',
  styleUrls: ['./unverified.component.scss'],
})
export class UnverifiedComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private _notification: NzNotificationService
  ) {}
  sendEmail() {
    this.authService.sendUserEmail().subscribe((res) => {
      this._notification.create(
        'success',
        'Verification',
        'Please check your email!'
      );
      this.router.navigateByUrl('/');
    });
  }
}
