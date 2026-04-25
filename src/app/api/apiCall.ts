import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AddChatBot, ApiKey, ApiKeyResponse, BaseResponse, ChatBotResponse, Login, LoginResponse, Register, VerifyOTP, VerifyOTPResponse } from '../model/todos.type';
import { getAccessToken } from './auth';

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
};

const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private http: HttpClient) { }


    login(data: Login) {
        return this.http.post<LoginResponse>(apiEndpoints.login, data, { headers });
    }

    register(data: Register) {
        return this.http.post<BaseResponse>(apiEndpoints.register, data, { headers });
    }

    verifyOTP(data: VerifyOTP) {
        return this.http.post<VerifyOTPResponse>(apiEndpoints.verifyOTP, data, { headers });
    }

    addChatBot(data: AddChatBot) {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('topic', data.topic);
        formData.append('file', data.image);
        const fileHeaders = new HttpHeaders({
            'Content-Type': 'multipart/form-data'
        })
        return this.http.post<BaseResponse>(apiEndpoints.addChatBot, formData);
    }

    createApiKey(id: number) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<BaseResponse>(`${apiEndpoints.createApiKey}/${id}`, { headers });
    }

    getBots() {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<ChatBotResponse>(`${apiEndpoints.getBots}`, { headers });
    }

    getApiKey(id: number) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<ApiKeyResponse>(`${apiEndpoints.getApiKey}/${id}`, { headers });
    }

    changeStatus(id: number, status: boolean) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<ApiKey>(`${apiEndpoints.activateKey}/${id}/${status}`, { headers });
    }

    getKeys(id: number) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<ApiKey>(`${apiEndpoints.getKey}/${id}`, { headers });
    }

    deleteApiKey(id: number) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<BaseResponse>(`${apiEndpoints.deleteApiKey}/${id}`, { headers });
    }

    logout() {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        return this.http.get<BaseResponse>(`${apiEndpoints.logout}`, { headers });
    }
}