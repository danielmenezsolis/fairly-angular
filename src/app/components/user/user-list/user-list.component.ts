import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit 
{
 users: User[] = [];
 loading = false;
 error = '';

 constructor(private userService: UserService) { }
 ngOnInit(): void {
    this.loadUsers();
 }
  loadUsers(): void {
    this.loading = true;
    this.error = '';
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteUser(userId: string): void {
    if(confirm('Deseas eliminar al usuario?')) {
       this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          this.error = 'Fallo al eliminar';
          console.error(err);
        }
      });
    }
  }
  
}
