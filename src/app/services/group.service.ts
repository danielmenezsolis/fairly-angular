import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Group } from '../models/group.model';
import { User } from '../models/user.model';
import {Expense} from "../models/expense.model";
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private apiUrl = `${environment.apiUrl}/group`;

  constructor(private http: HttpClient) { }

  getGroups(): Observable<Group[]>{
    return this.http.get<Group[]>(`${this.apiUrl}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getGroupMembers(groupId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${groupId}/members`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getGroupExpenses(groupId: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/${groupId}/expenses`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  createGroup(group: Partial<Group>): Observable<Group> {
     return this.http.post<Group>(`${this.apiUrl}`, group)
       .pipe(catchError((error) => this.handleError(error)));
  }

  addMemberToGroup(groupId: number, userId: string): Observable<any> 
  {
    return this.http.post(`${this.apiUrl}/${groupId}/members`, JSON.stringify(userId),{headers: {'Content-Type': 'application/json'}}).
    pipe(catchError((error) => this.handleError(error)));
  }

  removeMemberFromGroup(groupId: number, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${groupId}/members/${userId}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateGroup(id: number, group: Partial<Group>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { ...group, id })
      .pipe(catchError((error) => this.handleError(error)));
  }
  deleteGroup(id: number): Observable<void> {
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
