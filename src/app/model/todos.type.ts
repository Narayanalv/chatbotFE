export interface BaseResponse {
    status: number
    message: string
}

export interface VerifyOTPResponse extends BaseResponse {
    accessToken: string
}

export interface LoginResponse extends BaseResponse {
    accessToken: string
}

export interface Login {
    email: string
    password: string
    rememberMe?: boolean
}

export interface Register extends Login {
    name: string
    confirmPassword: string
}

export interface VerifyOTP {
    email: string
    otp: number
}

export interface ResendOTP {
    email: string
}

export interface AddChatBot {
    title: string
    topic: string
    image: File
}

export interface ChatBotResponse extends BaseResponse {
    chatBot: ChatBot[]
}

export interface ChatBot {
    id: number
    title: string
    topic: string
    imageUrl: string
    chunkedData: string
    status: string
    CreatedDate: string
}