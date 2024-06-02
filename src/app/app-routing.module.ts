import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { HomeRedirectGuard } from './guards/home-redirect.guard';
import { CheckComponent } from './components/check/check.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { RestockProductComponent } from './components/restock-product/restock-product.component';
import { UnverifiedComponent } from './components/unverified/unverified.component';
import { VerificationGuard } from './guards/verification.guard';
import { EmailConfirmComponent } from './components/email-confirm/email-confirm.component';
import { EmailConfirmedComponent } from './components/email-confirmed/email-confirmed.component';
import { AddProductComponent } from './components/add-product/add-product.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [HomeRedirectGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    // canActivate: [HomeRedirectGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'product/:id', component: ProductComponent },
  { path: 'cart', component: CartComponent },
  {
    path: 'checkout',
    component: CheckComponent,
    canActivate: [AuthGuard, VerificationGuard],
  },
  {
    path: 'order-history',
    component: OrderHistoryComponent,
    canActivate: [AuthGuard],
  },
  { path: 'newUser', component: NewUserComponent },
  {
    path: 'restockProducts',
    component: RestockProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'unverified',
    component: UnverifiedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'email-confirm',
    component: EmailConfirmComponent,
  },
  {
    path: 'emailConfirmed',
    component: EmailConfirmedComponent,
  },
  {
    path: 'add-Product',
    component: AddProductComponent,
    canActivate: [AuthGuard],
  },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
