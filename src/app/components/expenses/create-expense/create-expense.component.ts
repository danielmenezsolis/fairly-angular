import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExpenseService } from '../../../services/expense.service';
import { UserService } from '../../../services/user.service';
import { GroupService } from '../../../services/group.service';
import { Group, GroupMember } from '../../../models/group.model';
import { User } from '../../../models/user.model';
import { CreateExpenseDto } from '../../../models/dtos.model';

@Component({
  selector: 'app-create-expense',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './create-expense.component.html',
  styleUrl: './create-expense.component.scss',
})
export class CreateExpenseComponent implements OnInit {
  groupId!: number;
  group: Group | null = null;
  members: User[] = [];
  loading = true;
  error = '';
  success = false;

  expense: CreateExpenseDto = {
    groupId: 0,
    payerId: '',
    totalAmount: 0,
    description: '',
    expenseDate: new Date().toISOString().split('T')[0],
    participantIds: [],
  };

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private expenseService: ExpenseService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    this.expense.groupId = this.groupId;
    this.loadGroupData();
  }
  loadGroupData(): void {
    this.loading = true;
    this.groupService.getGroupById(this.groupId).subscribe({
      next: (group) => {
        this.group = this.group;
        this.loadMembers();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar grupo';
        console.error(err);
      },
    });
  }

  loadMembers(): void {
    this.groupService.getGroupMembers(this.groupId).subscribe({
      next: (members) => {
        this.members = members;
        this.expense.participantIds = members.map((m) => m.id);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falla al cargar los miembros del grupo';
        this.loading = false;
        console.error(err);
      },
    });
  }

  toggleParticipant(userId: string) : void
  {
    const index = this.expense.participantIds.indexOf(userId);
    if( index > -1){
      this.expense.participantIds.splice(index,1);
    } 
    else{
      this.expense.participantIds.push(userId); 
    }
  }

  isParticipantSelected(userId:string): boolean {
    return this.expense.participantIds.includes(userId);
  }
  
  onSubmit():void{
    if(!this.expense.groupId){
      this.error = 'No grupo';
      return;
    }
    if(!this.expense.payerId){
      this.error = 'Selecciona pagador';
      return;
    }
    if(this.expense.totalAmount <= 0){
      this.error = 'Monto mayor a 0';
      return;
    }
    if(!this.expense.description.trim()){
      this.error = 'Descripcion';
      return;
    }
    if (this.expense.participantIds.length === 0) {
      this.error = 'Selecciona al menos un participante';
      return;
    }


    this.expenseService.createExpenseEqualSplit(this.expense).subscribe(
    { next: (created) => 
    {
      this.success = true;
      this.loading = false;
      setTimeout (()=>{
        this.router.navigate(['/groups', this.groupId]);
      },1500);
    }, error : (err) => {
      this.error = 'No se pudo crear el gasto';
      this.loading = false;
      console.error(err);
    }

    });



  }


}
