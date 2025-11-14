import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  loading = false;
  error = '';
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email) {
      this.error = 'Ingresa Email';
      return;
    }
    this.loading = true;
    this.error = '';

    this.userService.getUsers().subscribe({
      next: (users) => {
        const user = users.find(
          (u) => u.email.toLowerCase() === this.email.toLowerCase()
        );
        if (user) {
          localStorage.setItem('CurrentUser', JSON.stringify(user));
          this.authService.login(user);
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Usuario No encontrado';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = 'Error al conectar';
        this.loading = false;
        console.error('Error', err);
      },
    });
  }
}
