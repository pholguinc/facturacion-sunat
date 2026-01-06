export interface AuthLoginResponse {
    statusCode: number;
    message: string;
    errors: string;
    data: {
        access_token: string;
    };
}