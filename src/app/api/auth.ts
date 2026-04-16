import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from "@angular/router";
import { ApiService } from "./apiCall";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private apiService: ApiService, private router: Router) { }

    isLogin() {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem("accessToken") !== null && this.isLoginApi();
        }
        return false;
    }

    logout() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem("accessToken");
            this.apiService.logout()
        }
    }

    isLoginApi(): boolean {
        let isLoggedIn = false;
        this.apiService.isLoggedIn().subscribe({
            next: (res) => {
                console.log(res);
                isLoggedIn = res.status === 200;
            },
            error: (err) => {
                console.log(err);
                isLoggedIn = false;
            }
        });
        return isLoggedIn;
    }
}

export function getAccessToken(): string | null {
    if (typeof localStorage !== 'undefined') {
        return localStorage.getItem("accessToken");
    }
    return null;
}

const PUBLIC_URLS = ['/api/login', '/api/register', '/api/verifyOTP'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const isPublic = PUBLIC_URLS.some(url => req.url.includes(url));
    if (isPublic) {
        return next(req);
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned);
    }

    return next(req);
};
