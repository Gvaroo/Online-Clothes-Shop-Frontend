import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RegisterUserDTO } from '../models/User/RegisterUserDTO';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { LoginUserDTO } from '../models/User/LoginUserDTO';
import { UpdateProfileDTO } from '../models/User/UpdateProfileDTO';
import { ExternalLoginInfoDTO } from '../models/User/ExternalLoginInfoDTO';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(user: RegisterUserDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Auth/Register`, user);
  }

  login(user: LoginUserDTO): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}Auth/Login`, user, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          console.log(response);
          localStorage.setItem('fullName', response.data.fullName);
          localStorage.setItem('email', response.data.email);
        })
      );
  }
  sendVerificationCode(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}auth/SendVerificationCode`,
      null,
      {
        withCredentials: true,
      }
    );
  }
  updateProfile(newProfile: UpdateProfileDTO): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}auth/UpdateProfile`, newProfile, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('fullName', response.data.fullName);
          localStorage.setItem('email', response.data.email);
        })
      );
  }
  sendUserEmail(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}auth/SentEmailConfirmationEmail`,
      null,
      {
        withCredentials: true,
      }
    );
  }
  verifyUserEmail(code: string): Observable<any> {
    const params = new HttpParams().set('code', code);
    return this.http.post<any>(`${this.apiUrl}auth/VerifyUserEmail`, null, {
      params,
      withCredentials: true,
    });
  }

  // Method to handle the response from the backend
  handleExternalAuthenticationResponse(user: ExternalLoginInfoDTO) {
    return this.http
      .post<any>(
        `${this.apiUrl}auth/HandleExternalAuthenticationResponse`,
        user,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((response) => {
          if (response.data.newUser == null) {
            localStorage.setItem('external', 'true');
            localStorage.setItem('fullName', response.data.fullName);
            localStorage.setItem('email', response.data.email);
          }
        })
      );
  }
  createNewExternalUser(credentials: ExternalLoginInfoDTO) {
    return this.http
      .post<any>(`${this.apiUrl}auth/RegisterNewExternalUser`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('external', 'true');
          localStorage.setItem('fullName', response.data.fullName);
          localStorage.setItem('email', response.data.email);
        })
      );
  }
  //check if user is admin
  isAdmin(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}auth/IsAdmin`, {
      withCredentials: true,
    });
  }

  //
  isLoggedIn(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}auth/IsLoggedIn`, {
      withCredentials: true,
    });
  }
  //
  isVerified(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}auth/IsVerified`, {
      withCredentials: true,
    });
  }

  logout(): Observable<boolean> {
    return this.http
      .get<any>(`${this.apiUrl}auth/LogOut`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          localStorage.clear();
        })
      );
  }
}
