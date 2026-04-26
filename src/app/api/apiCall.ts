import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { switchMap, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { AddChatBot, ApiKey, ApiKeyResponse, BaseResponse, ChatBotResponse, Login, LoginResponse, Register, TestChatbot, VerifyOTP, VerifyOTPResponse } from '../model/todos.type';
import { AuthService, getAccessToken } from './auth';
import { ToastService } from './toastService/toast.service';

// You can access your Base API URL like this:
export const API_BASE_URL = environment.apiUrl;

// Example Setup for API calls (You can use Angular's HttpClient instead in services)
export const apiEndpoints = {
    login: `${API_BASE_URL}/api/login`,
    register: `${API_BASE_URL}/api/register`,
    verifyOTP: `${API_BASE_URL}/api/verifyOTP`,
    addChatBot: `${API_BASE_URL}/api/addChatBot`,
    createApiKey: `${API_BASE_URL}/api/createApiKey`,
    getApiKey: `${API_BASE_URL}/api/getApiKey`,
    logout: `${API_BASE_URL}/api/logout`,
    getBots: `${API_BASE_URL}/api/getBots`,
    activateKey: `${API_BASE_URL}/api/activateKey`,
    getKey: `${API_BASE_URL}/api/getKey`,
    deleteApiKey: `${API_BASE_URL}/api/deleteApiKey`,
    Chatbot: `${API_BASE_URL}/chat/Chatbot`,
};

const headers = new HttpHeaders({ 'Content-Type': 'application/json' });


@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private http: HttpClient, private injector: Injector) { }

    login(data: Login) {
        return this.http.post<LoginResponse>(apiEndpoints.login, data, { headers })
            .pipe(switchMap(res => from(checkStatusCode<LoginResponse>(res, this.injector))));
    }

    register(data: Register) {
        return this.http.post<BaseResponse>(apiEndpoints.register, data, { headers })
            .pipe(switchMap(res => from(checkStatusCode<BaseResponse>(res, this.injector))));
    }

    verifyOTP(data: VerifyOTP) {
        return this.http.post<VerifyOTPResponse>(apiEndpoints.verifyOTP, data, { headers })
            .pipe(switchMap(res => from(checkStatusCode<VerifyOTPResponse>(res, this.injector))));
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
            .pipe(switchMap(res => from(checkStatusCode<BaseResponse>(res, this.injector))));
    }

    createApiKey(id: number) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<BaseResponse>(`${apiEndpoints.createApiKey}/${id}`, { headers })
            .pipe(switchMap(res => from(checkStatusCode<BaseResponse>(res, this.injector))));
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
            .pipe(switchMap(res => from(checkStatusCode<BaseResponse>(res, this.injector))));
    }

    logout() {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<BaseResponse>(`${apiEndpoints.logout}`, { headers })
            .pipe(switchMap(res => from(checkStatusCode<BaseResponse>(res, this.injector))));
    }

    testChatbot(id: number, message: string) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.post<TestChatbot>(`${apiEndpoints.Chatbot}/${id}`, { message }, { headers })
            .pipe(switchMap(res => from(checkStatusCode<TestChatbot>(res, this.injector))));
    }
}
function checkStatusCode<T>(response: any, injector?: Injector): Promise<T> {
    if (response.status === 200) {
        return Promise.resolve(response);
    } else if (response.status === 401) {
        console.log("error", response);
        if (injector) injector.get(AuthService).logout();
        return Promise.reject(response);
    } else {
        console.log("error", response);
        if (injector) injector.get(ToastService).showError(response.message ?? "Something went wrong");
        return Promise.reject(response);
    }
}
