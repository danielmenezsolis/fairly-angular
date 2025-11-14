import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getUserGroups(userId?: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/${userId}/groups`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user)
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateUser(id: string, user: Partial<User>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { ...user, id })
      .pipe(catchError((error) => this.handleError(error)));
  }

  deleteUser(id?: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}\nMensaje: ${error.error?.message || error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}