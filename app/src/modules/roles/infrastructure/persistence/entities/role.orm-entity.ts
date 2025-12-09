import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleOrmEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Index('UQ_roles_name', { unique: true })
    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
        unique: true,
    })
    name: string;
}