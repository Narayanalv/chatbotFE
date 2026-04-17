import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LoginPage } from './pages/login-page/login-page';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
    {
        path: "",
        component: Home
    },
    {
        path: "login",
        component: LoginPage
    },
    // {
    //     path: "register",
    //     component: LoginPage
    // },
    // {
    //     path: "verify-otp",
    //     component: LoginPage
    // },
    {
        path: "dashboard",
        component: Dashboard
    },
];
