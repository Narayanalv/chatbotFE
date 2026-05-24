import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LoginPage } from './pages/login-page/login-page';
import { Dashboard } from './pages/dashboard/dashboard';
import { Features } from './pages/features/features';
import { Technology } from './pages/technology/technology';
import { HowItWorks } from './pages/how-it-works/how-it-works';
import { About } from './pages/about/about';

export const routes: Routes = [
    {
        path: "",
        component: Home
    },
    {
        path: "login",
        component: LoginPage
    },
    {
        path: "dashboard",
        component: Dashboard
    },
    {
        path: "features",
        component: Features
    },
    {
        path: "technology",
        component: Technology
    },
    {
        path: "how-it-works",
        component: HowItWorks
    },
    {
        path: "about",
        component: About
    }
];
