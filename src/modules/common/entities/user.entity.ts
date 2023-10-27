import {BaseEntity} from '@/core';
import {Entity} from 'typeorm';

@Entity({name: 'user'})
export class UserEntity extends BaseEntity {}
