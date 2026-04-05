import { ApiService } from "./apiCall";

export function isLogin() {
    if (typeof localStorage !== 'undefined') {
        return localStorage.getItem("accessToken") !== null;
    }
    return false;
}

export function isValidToken() {

}

export function logout() {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem("accessToken");
    }
}