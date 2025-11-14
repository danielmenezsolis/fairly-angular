import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';          
import { RouterLink } from '@angular/router';
import { GroupService } from '../../../services/group.service';
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
  constructor(private groupService: GroupService) { }

  ngOnInit(): void { 
    this.loadGroups();
  }

  loadGroups(): void {
    this.loading = true;
    this.error = '';
    this.groupService.getGroups().subscribe({
      next: (data) => {
        this.groups = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load groups';
        this.loading = false;
        console.error(err);
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
