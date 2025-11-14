import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem('CurrentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get CurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(user: User) : void {
    localStorage.setItem('CurrentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() : void
  {
     localStorage.removeItem("CurrentUser");
     this.currentUserSubject.next(null);
  }
    
  isLogged(): boolean {
     return this.CurrentUserValue !== null;
  }
}

