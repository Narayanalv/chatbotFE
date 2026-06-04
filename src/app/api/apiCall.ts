import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector, signal } from '@angular/core';
import { switchMap, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { AddChatBot, ApiKey, ApiKeyResponse, BaseResponse, ChatBotResponse, ForgotPassword, HistoryResponse, Login, LoginResponse, NewPassword, Register, ResetPassword, TestChatbot, VerifyOTP, VerifyOTPResponse } from '../model/todos.type';
import { authConfig, AuthService, getAccessToken } from './auth';
import { ToastService } from './toastService/toast.service';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

// You can access your Base API URL like this:
export const API_BASE_URL = environment.apiUrl;

// Example Setup for API calls (You can use Angular's HttpClient instead in services)
export const apiEndpoints = {
    login: `${API_BASE_URL}/api/login`,
    register: `${API_BASE_URL}/api/register`,
    verifyOTP: `${API_BASE_URL}/api/verifyOTP`,
    verifyForgot: `${API_BASE_URL}/api/verifyForgot`,
    changePassword: `${API_BASE_URL}/api/changePassword`,
    addChatBot: `${API_BASE_URL}/api/addChatBot`,
    createApiKey: `${API_BASE_URL}/api/createApiKey`,
    getApiKey: `${API_BASE_URL}/api/getApiKey`,
    logout: `${API_BASE_URL}/api/logout`,
    getBots: `${API_BASE_URL}/api/getBots`,
    activateKey: `${API_BASE_URL}/api/activateKey`,
    getKey: `${API_BASE_URL}/api/getKey`,
    deleteApiKey: `${API_BASE_URL}/api/deleteApiKey`,
    Chatbot: `${API_BASE_URL}/chat/Chatbot`,
    chatHistory: `${API_BASE_URL}/api/getBot/history`,
    forgotPassword: `${API_BASE_URL}/api/forgotPassword`,
    resetPassword: `${API_BASE_URL}/api/resetPassword`,
    googleLogin: `${API_BASE_URL}/api/auth/google/login`,
    googleRegister: `${API_BASE_URL}/api/auth/google/register`,
};

const headers = new HttpHeaders({ 'Content-Type': 'application/json' });


@Injectable({ providedIn: 'root' })
export class ApiService {
    public isLoading = signal(false);
    private activeRequests = 0;

    constructor(private http: HttpClient, private injector: Injector, private oAuth: OAuthService) {
        if (typeof window !== 'undefined') {
            this.oAuth.configure(authConfig);
        }
    }

    incrementRequests() {
        this.activeRequests++;
        this.isLoading.set(true);
    }

    decrementRequests() {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        this.isLoading.set(this.activeRequests > 0);
    }

    login(data: Login) {
        return this.http.post<LoginResponse>(apiEndpoints.login, data, { headers })
            .pipe(switchMap(res => from(checkStatusCode<LoginResponse>(res, this.injector))));
    }

    register(data: Register) {
        return this.http.post<BaseResponse>(apiEndpoints.register, data, { headers })
            .pipe(switchMap(res => from(checkStatusCode<BaseResponse>(res, this.injector, true))));
    }

    verifyOTP(data: VerifyOTP) {
        return this.http.post<VerifyOTPResponse>(apiEndpoints.verifyOTP, data, { headers })
            .pipe(switchMap(res => from(checkStatusCode<VerifyOTPResponse>(res, this.injector, true))));
    }

    verifyForgot(data: VerifyOTP) {
        return this.http.post<VerifyOTPResponse>(apiEndpoints.verifyForgot, data, { headers })
            .pipe(switchMap(res => from(checkStatusCode<VerifyOTPResponse>(res, this.injector, true))));
    }

    forgotPassword(data: ForgotPassword) {
        return this.http.post<BaseResponse>(apiEndpoints.forgotPassword, data, { headers })
            .pipe(switchMap(res => from(checkStatusCode<BaseResponse>(res, this.injector, true))));
    }

    resetPassword(data: NewPassword) {
        return this.http.post<BaseResponse>(apiEndpoints.resetPassword, data, { headers })
            .pipe(switchMap(res => from(checkStatusCode<BaseResponse>(res, this.injector, true))));
    }

    addChatBot(data: AddChatBot) {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('topic', data.topic);
        formData.append('file', data.image);
        const fileHeaders = new HttpHeaders({
            'Content-Type': 'multipart/form-data'
        })
        return this.http.post<BaseResponse>(apiEndpoints.addChatBot, formData)
            .pipe(switchMap(res => from(checkStatusCode<BaseResponse>(res, this.injector, true))));
    }

    createApiKey(id: number) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<BaseResponse>(`${apiEndpoints.createApiKey}/${id}`, { headers })
            .pipe(switchMap(res => from(checkStatusCode<BaseResponse>(res, this.injector, true))));
    }

    getBots() {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<ChatBotResponse>(`${apiEndpoints.getBots}`, { headers })
            .pipe(switchMap(res => from(checkStatusCode<ChatBotResponse>(res, this.injector))));
    }

    getApiKey(id: number) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<ApiKeyResponse>(`${apiEndpoints.getApiKey}/${id}`, { headers })
            .pipe(switchMap(res => from(checkStatusCode<ApiKeyResponse>(res, this.injector))));
    }

    changeStatus(id: number, status: boolean) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<ApiKey>(`${apiEndpoints.activateKey}/${id}/${status}`, { headers })
            .pipe(switchMap(res => from(checkStatusCode<ApiKey>(res, this.injector))));
    }

    getKeys(id: number) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<ApiKey>(`${apiEndpoints.getKey}/${id}`, { headers })
            .pipe(switchMap(res => from(checkStatusCode<ApiKey>(res, this.injector))));
    }

    deleteApiKey(id: number) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<BaseResponse>(`${apiEndpoints.deleteApiKey}/${id}`, { headers })
            .pipe(switchMap(res => from(checkStatusCode<BaseResponse>(res, this.injector, true))));
    }

    logout() {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<BaseResponse>(`${apiEndpoints.logout}`, { headers })
            .pipe(switchMap(res => from(checkStatusCode<BaseResponse>(res, this.injector))));
    }

    testChatbot(id: number, message: string) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.post<TestChatbot>(`${apiEndpoints.Chatbot}/${id}`, { message }, { headers })
            .pipe(switchMap(res => from(checkStatusCode<TestChatbot>(res, this.injector, false))));
    }

    getChatHistory(chatBotId: number, page: number = 0, size: number = 50) {
        return this.http.get<HistoryResponse>(
            `${apiEndpoints.chatHistory}/${chatBotId}?page=${page}&size=${size}`,
            { headers }
        ).pipe(switchMap(res => from(checkStatusCode<HistoryResponse>(res, this.injector))));
    }

    googleLoginWithToken(token: string) {
        return this.http.post<LoginResponse>(apiEndpoints.googleLogin, { token }, { headers })
            .pipe(switchMap(res => from(checkStatusCode<LoginResponse>(res, this.injector, true))));
    }

    googleRegisterWithToken(token: string) {
        return this.http.post<LoginResponse>(apiEndpoints.googleRegister, { token }, { headers })
            .pipe(switchMap(res => from(checkStatusCode<LoginResponse>(res, this.injector, true))));
    }
}
function checkStatusCode<T>(response: any, injector?: Injector, showToast: boolean = false): Promise<T> {
    if (response.status === 200) {
        if (showToast && injector && response.message) {
            injector.get(ToastService).showSuccess(response.message);
        }
        return Promise.resolve(response);
    } else if (response.status === 401) {
        console.log("error", response);
        if (injector) {
            injector.get(AuthService).logout();
            injector.get(Router).navigate(["/login"]);
        }
        return Promise.reject(response);
    } else {
        console.log("error", response);
        if (injector) injector.get(ToastService).showError(response.message ?? "Something went wrong");
        return Promise.reject(response);
    }
}
