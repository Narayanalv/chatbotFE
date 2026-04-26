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
    listBot: ChatBot[],
    hasData: boolean
}

export interface ChatBot {
    id: number
    title: string
    topic: string
    imageUrl: string
    chunkedData: 1 | 2 | 0
    status: string
    CreatedDate: string
}

export interface ApiKey extends BaseResponse {
    apiKey: String
}

export interface ApiKeyResponse extends BaseResponse {
    apiKeyList: ApiKeyList
}

export interface ApiKeyList {
    id: number
    apiKey: string // masked apiKey
    status: boolean
    visible?: boolean
}

export interface TestChatbot extends BaseResponse {
    messageText: string
}