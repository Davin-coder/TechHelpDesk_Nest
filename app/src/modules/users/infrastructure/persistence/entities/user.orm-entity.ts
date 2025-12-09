import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { RoleOrmEntity } from '../../../../roles/infrastructure/persistence/entities/role.orm-entity';

@Entity({ name: 'users' })
@Index('IDX_users_role_id', ['role'])
@Index('IDX_users_is_active', ['isActive'])
export class UserOrmEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Index('UQ_users_username', { unique: true })
    @Column({
        type: 'varchar',
        length: 50,
        unique: true,
        nullable: false,
    })
    username: string;

    @Index('UQ_users_email', { unique: true })
    @Column({
        type: 'varchar',
        length: 100,
        unique: true,
        nullable: false,
    })
    email: string;

    @Exclude()
    @Column({
        name: 'password_hash',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    passwordHash: string;

    @ManyToOne(() => RoleOrmEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'role_id' })
    role: RoleOrmEntity;

    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
    })
    isActive: boolean;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
    })
    createdAt: Date;
}