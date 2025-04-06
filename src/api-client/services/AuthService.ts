/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * User login
     * Verifies user credentials and returns user data upon successful login
     * @param requestBody
     * @returns any Successful login
     * @throws ApiError
     */
    public static login(
        requestBody: {
            email: string;
            password: string;
        },
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: {
            id?: number;
            email?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Generate OAuth token
     * Generates an access token using user credentials.
     * @param requestBody User credentials
     * @returns any Successful token generation
     * @throws ApiError
     */
    public static issueToken(
        requestBody: {
            grant_type: string;
            client_id: string;
            client_secret: string;
            username: string;
            password: string;
        },
    ): CancelablePromise<{
        access_token?: string;
        refresh_token?: string;
        expires_in?: number;
        token_type?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/oauth/token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized. Invalid credentials.`,
            },
        });
    }
}
