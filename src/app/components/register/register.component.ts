import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalLoginInfoDTO } from 'src/app/models/User/ExternalLoginInfoDTO';
import { RegisterUserDTO } from 'src/app/models/User/RegisterUserDTO';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  newUser: RegisterUserDTO = {
    fullName: '',
    email: '',
    password: '',
  };
  externalUser: ExternalLoginInfoDTO = {
    email: '',
    fullName: '',
    provider: '',
    providerKey: '',
  };
  confirmPassword: string = '';
  errorMessage = '';
  loading = false;
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private externalAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.externalAuthService.authState.subscribe((user) => {
      this.sendGoogleUserDataToServer(user);
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (
      this.newUser.fullName &&
      this.newUser.password &&
      this.newUser.email &&
      this.confirmPassword
    ) {
      if (this.newUser.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords need to match';
      } else {
        this.loading = true;
        this._auth.register(this.newUser).subscribe(
          (res) => {
            this.loading = false;
            this._router.navigate(['/email-confirm']);
          },
          (err) => {
            this.errorMessage = err.error.message;
            this.loading = false;
          }
        );
      }
    } else {
      this.errorMessage = 'Make sure to fill everything ;)';
    }
  }

  canSubmit(): boolean {
    return this.newUser.fullName &&
      this.newUser.email &&
      this.newUser.password &&
      this.confirmPassword
      ? true
      : false;
  }
  private sendGoogleUserDataToServer(user: SocialUser) {
    (this.externalUser.email = user.email),
      (this.externalUser.providerKey = user.idToken),
      (this.externalUser.fullName = user.name),
      (this.externalUser.provider = user.provider);

    this._auth
      .handleExternalAuthenticationResponse(this.externalUser)
      .subscribe(
        (res) => {
          if (res.data.newUser) {
            const redirectUrl = `/newUser?email=${res.data.email}&fullName=${res.data.fullName}&provider=${res.data.provider}&key=${res.data.providerKey}`;
            window.location.href = redirectUrl;
            console.log('newUserDone');
          } else {
            this._router.navigateByUrl('/').then(() => {
              window.location.reload();
            });
          }
        },
        (err) => {
          console.log(err.error.message);
        }
      );
  }
}
