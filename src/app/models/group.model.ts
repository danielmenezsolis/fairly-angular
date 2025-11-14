import {User} from './user.model';

export interface Group{
    id:number;
    name:string;
    creatorId: string;
    createdAt?: Date;
    creator?: User;
    members?: GroupMember[];
}
export interface GroupMember{
    userId:string;
    groupId: number;
    user?: User;
}