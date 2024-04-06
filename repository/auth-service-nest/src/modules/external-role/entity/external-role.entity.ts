import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm'
import { DefaultDatabaseEntity } from '../../database/entity/default-database.entity'
import { ExternalServiceEntity } from '../../external-service/entity/external-service.entity'
import { UserEntity } from '../../user/entity/user.entity'

/**
 *  Entity describing roles in user related external services
 * */
@Entity({ name: 'external_role' })
export class ExternalRoleEntity extends DefaultDatabaseEntity<ExternalRoleEntity> {
    @Column()
    name: string

    @Column({ nullable: true })
    description?: string

    @Column({ default: false })
    default: boolean

    @Column({
        name: 'recognition_key',
        unique: true,
    })
    recognitionKey: string

    @ManyToOne(
        () => ExternalServiceEntity,
        (service) => service.externalRoles,
        {
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        },
    )
    @JoinColumn({name: 'external_service_id'})
    externalService: ExternalServiceEntity

    @Column({ name: 'external_service_id', })
    externalServiceId: string

    @ManyToMany(
        type => UserEntity,
        user => user.externalRoles,
        {
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        },
    )
    users: UserEntity[]
}