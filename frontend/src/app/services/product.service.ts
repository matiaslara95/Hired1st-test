import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { RegistrationResponse } from '../models/registration-response';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthResponse } from '../models/authentication-response';
import { ProductForManage } from '../models/product-for-manage';

@Injectable({
    providedIn: 'root'
})

export class ProductService {

    constructor(private http: HttpClient) { }

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    //Create product
    CreateProduct(body: ProductForManage): Observable<RegistrationResponse> {
        return this.http.post<RegistrationResponse>(`${environment.apiUrl}/product`, JSON.stringify(body), this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    GetProducts = (id: string) => {
        const params = new HttpParams().append('idUser', id);
        return this.http.get<Array<ProductForManage>>(`${environment.apiUrl}/product`, {params})
            .pipe(
                catchError(this.handleError)
            );
    }

    UpdateProduct = (body: ProductForManage) => {
        return this.http.put<AuthResponse>(`${environment.apiUrl}/product`, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    DeleteProduct = (body: ProductForManage) => {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: body
        };

        return this.http.delete<Array<ProductForManage>>(`${environment.apiUrl}/product`, options)
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