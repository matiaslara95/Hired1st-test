export interface AuthResponse {
    id: string;
    name: string;
    isAuthSuccessful: boolean;
    errorMessage: string;
    isTfaEnabled: boolean;
    token: string;
}