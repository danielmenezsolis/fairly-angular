import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { GroupService } from '../../../services/group.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss',
})
export class AddMemberComponent implements OnInit {
  groupId!: number;
  groupName = '';
  allUsers: User[] = [];
  currentMembers: User[] = [];
  availableUsers: User[] = [];
  selectedUserId = '';
  loading = false;
  error = '';
  success = false;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    this.loadData();
  }

  loadData(): void {
    this.groupService.getGroupById(this.groupId).subscribe({
      next: (group) => {
        this.groupName = group.name;
        this.loadMembers();
      },
      error: (err) => {
        this.error = 'Error al cargar el grupo';
        this.loading = false;
      },
    });
  }

  loadMembers(): void {
    this.groupService.getGroupMembers(this.groupId).subscribe({
      next: (members) => {
        this.currentMembers = members;
        this.loadAllUsers();
      },
      error: (err) => {
        this.error = 'Error al obtener miembros del grupo';
        this.loading = false;
      },
    });
  }

  loadAllUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        const membersId = this.currentMembers.map((m) => m.id);
        this.availableUsers = users.filter((u) => !membersId.includes(u.id));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No pudimos traer los usuarios';
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (!this.selectedUserId) {
      this.error = 'Selecciona Usuario';
      return;
    }
    this.loading = true;
    this.error = '';

    this.groupService
      .addMemberToGroup(this.groupId, this.selectedUserId)
      .subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['groups', this.groupId]);
          }, 1500);
        },
        error: (err) => {
          this.error = 'error al agregar';
          this.loading = false;
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/groups', this.groupId]);
  }
}
