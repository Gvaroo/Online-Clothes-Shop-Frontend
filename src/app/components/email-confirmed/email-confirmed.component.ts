import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-email-confirmed',
  templateUrl: './email-confirmed.component.html',
  styleUrls: ['./email-confirmed.component.scss'],
})
export class EmailConfirmedComponent {
  public confirmationMessage: string = '';
  isLoggedIn: boolean = false;
  isVerified: boolean = false;
  errorMessage = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    this.checkUser().then(() => {
      this.activatedRoute.queryParams.subscribe((params) => {
        const code = params['code'];
        if (code) {
          this.checkVerifyStatus().then((isVerified) => {
            if (!isVerified) {
              this._auth.verifyUserEmail(code).subscribe(
                (response) => {
                  this.confirmationMessage = response.data;
                },
                (error) => {
                  this.errorMessage = error.error.message;
                }
              );
            } else {
              this.confirmationMessage = 'You are already verified!';
            }
          });
        }
      });
    });
  }

  async checkUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._auth.isLoggedIn().subscribe(
        (res) => {
          this.isLoggedIn = res.data;
          resolve();
        },
        (err) => {
          this.isLoggedIn = false;
          resolve();
        }
      );
    });
  }

  async checkVerifyStatus(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._auth.isVerified().subscribe(
        (res) => {
          this.isVerified = res.data;
          resolve(this.isVerified);
        },
        (err) => {
          this.isVerified = false;
          resolve(false);
        }
      );
    });
  }
}
