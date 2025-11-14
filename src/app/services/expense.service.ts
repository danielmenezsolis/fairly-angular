import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Expense } from '../models/expense.model';
import { CreateExpenseDto, GroupBalanceSummary } from '../models/dtos.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) { }

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  createExpenseEqualSplit(expense: CreateExpenseDto): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/equal-split`, expense)
      .pipe(catchError((error) => this.handleError(error)));
  }

  createExpenseCustomSplit(expense: any): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/custom-split`, expense)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getGroupBalances(groupId: number): Observable<GroupBalanceSummary> {
    return this.http.get<GroupBalanceSummary>(`${this.apiUrl}/group/${groupId}/balances`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateExpense(id: number, expense: Partial<Expense>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { ...expense, id })
      .pipe(catchError((error) => this.handleError(error)));
  }

  deleteExpense(id: number): Observable<void> {
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