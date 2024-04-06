import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { DefaultDatabaseEntity } from '../../database/entity/default-database.entity'
import { ExternalServiceEntity } from '../../external-service/entity/external-service.entity'
import { ExternalRoleEntity } from '../../external-role/entity/external-role.entity'
import { ERole } from '../../common/enum/role.enum'

@Entity({
    name: 'user',
})
export class UserEntity extends DefaultDatabaseEntity<UserEntity> {
    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ default: false })
    verified: boolean

    @Column({ default: ERole.User })
    role: ERole

    @ManyToMany(
        () => ExternalServiceEntity,
        (externalService) => externalService.users,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            eager: true,
        },
    )
    @JoinTable({
        name: 'user_external_service',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'external_service_id',
            referencedColumnName: 'id',
        },
    })
    externalServices: ExternalServiceEntity[]

    @ManyToMany(
        () => ExternalRoleEntity,
        (externalRole) => externalRole.users,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            eager: true,
        },
    )
    @JoinTable({
        name: 'user_external_role',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'external_role_id',
            referencedColumnName: 'id',
        },
    })
    externalRoles: ExternalRoleEntity[]
}