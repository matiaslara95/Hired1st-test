import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { RegistrationResponse } from '../models/registration-response';
import { UserForRegistration } from '../models/user-for-registration';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserForAuthentication } from '../models/user-for-authentication';
import { AuthResponse } from '../models/authentication-response';
import { UserForManage } from '../models/user-for-manage';

@Injectable({
    providedIn: 'root'
})

export class AccountService {

    constructor(private http: HttpClient) { }

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    //Register user
    registerUser(body: UserForRegistration): Observable<RegistrationResponse> {
        return this.http.post<RegistrationResponse>(`${environment.apiUrl}/accounts/registration`, JSON.stringify(body), this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    //Register user
    Login = (body: UserForAuthentication) => {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/accounts/login`, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    GetUsers = () => {
        return this.http.get<Array<UserForManage>>(`${environment.apiUrl}/accounts`)
            .pipe(
                catchError(this.handleError)
            );
    }

    UpdateUser = (body: UserForManage) => {
        return this.http.put(`${environment.apiUrl}/accounts`, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    DeleteUser = (body: UserForManage) => {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: body
        };

        return this.http.delete(`${environment.apiUrl}/accounts`, options)
            .pipe(
                catchError(this.handleError)
            );
    }

    protected handleError(error: HttpErrorResponse) {
        let errorMessage: string;
        if (typeof error === 'string') {
            errorMessage = error;
        } else {
            if (error.error instanceof ErrorEvent) {
                // A client-side or network error occurred. Handle it accordingly.
                errorMessage = `An error occurred: ${error.error.message}`;
            } else {
                // The backend returned an unsuccessful response code.
                // The response body may contain clues as to what went wrong,
                errorMessage = `Backend returned code ${error.status}, with body ${error.message}`;
            }
        }
        console.log(error);
        console.error(error);
        // return an ErrorObservable with a user-facing error message
        return throwError(errorMessage);
    }
}