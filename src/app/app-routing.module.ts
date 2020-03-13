import { NgModule, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginGuard } from './core/guards/login.guard';
import { MovieComponent } from './pages/movie/movie.component';
import { MovieResolver } from './core/resolver/movie-resolver';
import { RegisterComponent } from './pages/register/register.component';

import { MyAccountComponent } from './pages/my-account/my-account.component';

import { AddMovieComponent } from './core/pages/add-movie/add-movie.component';
import { AddCommentComponent } from './core/pages/add-comment/add-comment.component';


const routes: Routes = [
  {
    path:'',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path:'home',
    component: HomeComponent
  },
  {
    path:'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path:'myAccount',
    component: MyAccountComponent,
    // canActivate: [MyAccountGuard]
  },
  {
    path:'register',
    component: RegisterComponent
  },
  {
    path:'add-movie',
    component: AddMovieComponent
  },
  {
    path:'add-comment',
    component: AddCommentComponent
  },
  {
    path:'movie/:id',
    component: MovieComponent,
    resolve: {
      movie: MovieResolver
    }
  },
  {
    path:'**',
    redirectTo: 'home',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
