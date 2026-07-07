import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from "@angular/router";
import { ApiService } from "./apiCall";
import { Injectable, inject } from "@angular/core";
import { ToastService } from './toastService/toast.service';
import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
import { finalize, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private apiService: ApiService, private router: Router, private toast: ToastService) { }

    isLogin(): boolean {
        if (typeof localStorage !== 'undefined') {
            const accessToken = localStorage.getItem("accessToken");
            return accessToken !== null && !this.isExpired(accessToken);
        }
        return false;
    }

    logout(): void {
        if (typeof localStorage !== 'undefined') {
            this.toast.showSuccess("Logout successfully");
            localStorage.removeItem("accessToken");
            this.apiService.logout().subscribe({
                next: () => { },
                error: () => { }
            });
        }
        this.router.navigate(["/login"]);
    }

    isExpired(accessToken: string | null): boolean {
        if (!accessToken) return true;

        try {
            const payload = accessToken.split('.')[1];
            const decoded = JSON.parse(atob(payload));

            console.log(decoded);

            if (decoded.exp && decoded.app === "chatbot-ai") {
                const exp = decoded.exp * 1000; // convert to ms
                return Date.now() >= exp; // true if expired
            }

            return true; // invalid token
        } catch (error) {
            return true;
        }
    }

    // isLoginApi(): boolean {
    //     let isLoggedIn = false;
    //     this.apiService.isLoggedIn().subscribe({
    //         next: (res) => {
    //             console.log(res);
    //             isLoggedIn = res.status === 200;
    //         },
    //         error: (err) => {
    //             console.log(err);
    //             isLoggedIn = false;
    //         }
    //     });
    //     return isLoggedIn;
    // }
}

export function getAccessToken(): string | null {
    if (typeof localStorage !== 'undefined') {
        return localStorage.getItem("accessToken");
    }
    return null;
}

const PUBLIC_URLS = ['/api/login', '/api/register', '/api/verifyOTP', '/api/auth/google'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const isPublic = PUBLIC_URLS.some(url => req.url.includes(url));
    if (isPublic) {
        return next(req);
    }

    // Do not add the Authorization header to external requests (such as Google OpenID configuration)
    const isExternal = req.url.startsWith('http') && !req.url.startsWith(environment.apiUrl);
    if (isExternal) {
        return next(req);
    }

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    let requestToForward = req;
    if (token) {
        requestToForward = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    const router = inject(Router);
    const toast = inject(ToastService);

    return next(requestToForward).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                console.log("Unauthorized request intercepted", error);
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem("accessToken");
                }
                toast.showError("Session expired or unauthorized. Please login again.");
                router.navigate(["/login"]);
            }
            return throwError(() => error);
        })
    );
};

export const authConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    strictDiscoveryDocumentValidation: false,
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/login' : '',
    clientId: '884028107017-o8r0i2ofu1i99en6i94ulpg1q4ujno5g.apps.googleusercontent.com',
    scope: 'openid email profile',
    showDebugInformation: true,
};

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const apiService = inject(ApiService);
    const isChatbotRequest = req.url.includes('/chat/Chatbot') || req.url.includes('/api/getBot/history');

    if (isChatbotRequest) {
        return next(req);
    }

    apiService.incrementRequests();
    return next(req).pipe(
        finalize(() => {
            apiService.decrementRequests();
        })
    );
};
