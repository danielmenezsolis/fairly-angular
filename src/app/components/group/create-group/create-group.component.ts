import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink  } from '@angular/router'; 
import { GroupService } from '../../../services/group.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';  
import { retry } from 'rxjs';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent implements OnInit {
   currentUser = this.authService.CurrentUserValue;
   groupName = '';
   allUsers : User []  = [] ;
   selectedMembers : string[] = [];
   loading = false;
   error = '';
   success = false;
  
  constructor(
    private router : Router,
    private groupService: GroupService,
    private userService:UserService,
    private authService:AuthService 
   ){}

  ngOnInit(): void {
    if (!this.currentUser?.id) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUsers();
  }
  
  loadUsers():void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) =>{
          this.allUsers = users.filter(u => u.id !== this.currentUser?.id);
          this.loading = false;
      }
    })
  }

  toggleMember(userId:string):void{
    const index = this.selectedMembers.indexOf(userId)
    if(index > -1)
    {
      this.selectedMembers.splice(index,1)
    }
    else{
      this.selectedMembers.push(userId);
    }
  }

  isMemberSelected(userId: string) : boolean
  {
    return this.selectedMembers.includes(userId);
  }

  onSubmit():void
  {
  if(!this.groupName.trim())
  {
    this.error = 'Ingresa Nombre de Grupo'
    return
  }
  if(!this.currentUser?.id)
  {
    this.error = 'Usuario no autenticado'
    return;
  }
  this.loading = true;
  this.error = ''

  this.groupService.createGroup({name:this.groupName,creatorId:this.currentUser?.id}).subscribe({
    next : (group) => {
      if(this.selectedMembers.length > 0)
      {
        this.addMembers(group.id)
      }
      else{
        this.success = true;
        this.redirectToGroup(group.id);
      }
    },error: (err) => {
      this.error = 'No se pudo crear grupo';
      this.loading= false;
    }
  })
}

 addMembers(groupId: number): void {
    let completed = 0;
    const total = this.selectedMembers.length;

    this.selectedMembers.forEach(userId => {
      this.groupService.addMemberToGroup(groupId, userId).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.success = true;
            this.redirectToGroup(groupId);
          }
        },
        error: (err) => {
          console.error('Error al agregar miembro:', err);
          completed++;
          if (completed === total) {
            this.success = true;
            this.redirectToGroup(groupId);
          }
        }
      });
    });
  }

  redirectToGroup(groupId: number): void {
    setTimeout(() => {
      this.router.navigate(['/groups', groupId]);
    }, 1500);
  }

  cancel(): void {
    this.router.navigate(['/groups']);
  }


}
