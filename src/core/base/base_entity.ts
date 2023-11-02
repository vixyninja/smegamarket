import {Expose} from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity as CoreEntity,
} from 'typeorm';

@Entity()
export class BaseEntity extends CoreEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Expose()
  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Expose()
  @DeleteDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  deletedAt: Date;
}
