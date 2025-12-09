import { Column, Entity, Index, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import { RoleOrmEntity } from '../../../../roles/infrastructure/persistence/entities/role.orm-entity';

@Entity({ name: 'access' })
@Index('UQ_access_role_resource', ['role', 'resource'], {
    unique: true,
})
export class AccessOrmEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @ManyToOne(() => RoleOrmEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'role_id' })
    role: RoleOrmEntity;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    resource: string;

    @Column({
        name: 'can_read',
        type: 'boolean',
        default: false,
    })
    canRead: boolean;

    @Column({
        name: 'can_create',
        type: 'boolean',
        default: false,
    })
    canCreate: boolean;

    @Column({
        name: 'can_update',
        type: 'boolean',
        default: false,
    })
    canUpdate: boolean;

    @Column({
        name: 'can_delete',
        type: 'boolean',
        default: false,
    })
    canDelete: boolean;
}