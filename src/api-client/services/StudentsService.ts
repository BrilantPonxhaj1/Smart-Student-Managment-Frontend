/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentsService {
    /**
     * Get a list of students
     * Retrieves a list of all students.
     * @returns any Successful operation
     * @throws ApiError
     */
    public static listStudents(): CancelablePromise<{
        students?: any;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students',
            errors: {
                401: `Unauthenticated`,
            },
        });
    }
}
