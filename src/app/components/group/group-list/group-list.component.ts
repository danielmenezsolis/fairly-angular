
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GroupService } from '../../../services/group.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Group } from '../../../models/group.model';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss'
})
export class GroupListComponent implements OnInit {
  groups: Group[] = [];
  loading = false;
  error = '';
  currentUser = this.authService.CurrentUserValue;

  constructor(private groupService: GroupService,
    private userService: UserService,
    private authService: AuthService) { }

  ngOnInit(): void { 
    this.loadGroups();
  }

  loadGroups(): void {
    if (!this.currentUser?.id) {
      this.error = 'Usuario no autenticado';
      return;
    }

    this.loading = true;
    this.error = '';
    
    // Obtener solo los grupos donde el usuario es miembro
    this.userService.getUserGroups(this.currentUser.id).subscribe({
      next: (data) => {
        this.groups = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar grupos: ' + err.message;
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  deleteGroup(groupId: number): void {
    if(confirm('Are you sure you want to delete this group?')) {
       this.groupService.deleteGroup(groupId).subscribe({
        next: () => {
          this.loadGroups();
        },
        error: (err) => {
          this.error = 'Failed to delete group';
          console.error(err);
        }
      });
    }
  }

  
        


}
