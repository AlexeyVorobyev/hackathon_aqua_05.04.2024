import { Inject, Injectable } from '@nestjs/common'
import { UserEntity } from './entity/user.entity'
import { UniversalError } from '../common/class/universal-error'
import { EUniversalExceptionType } from '../common/enum/exceptions'
import { BcryptService } from '../bcrypt/bcrypt.service'
import { ERole } from '../common/enum/role.enum'
import { CONFLICT_ERROR_MESSAGE, FORBIDDEN_ERROR_MESSAGE } from '../common/constant'
import { UserRepository } from './repository/user.repository'
import { FindOptionsWhere, In, Like } from 'typeorm'
import { UserUpdatePayloadInput } from './input/user-update-payload.input'
import { Builder } from 'builder-pattern'
import { userEntityToUserAttributesDtoAdapter } from './adapter/user-entity-to-user-attributes-dto.adapter'
import { UserListInput } from './input/user-list.input'
import { UserListAttributes } from './attributes/user-list.attributes'
import { UserAttributes } from './attributes/user.attributes'
import { ListMetaAttributes } from '../graphql/attributes/list-meta.attributes'
import { UserCreateInput } from './input/user-create.input'
import { UserUpdateMeInput } from './input/user-update-me.input'
import { listInputToFindOptionsWhereAdapter } from '../graphql/adapter/list-input-to-find-options-where.adapter'
import {
    sortInputListToFindOptionsOrderAdapter,
} from '../graphql/adapter/sort-input-list-to-find-options-order.adapter'
import { ExternalServiceRepository } from '../external-service/repository/external-service.repository'
import { ExternalRoleRepository } from '../external-role/repository/external-role.repository'


@Injectable()
export class UserService {
    constructor(
        @Inject(UserRepository)
        private readonly userRepository: UserRepository,
        @Inject(ExternalServiceRepository)
        private readonly externalServiceRepository: ExternalServiceRepository,
        @Inject(ExternalRoleRepository)
        private readonly externalRoleRepository: ExternalRoleRepository,
        @Inject(BcryptService)
        private readonly bcryptService: BcryptService,
    ) {
    }

    async getAll(input: UserListInput): Promise<UserListAttributes> {
        const filter: FindOptionsWhere<UserEntity> = {
            ...listInputToFindOptionsWhereAdapter<UserEntity>(input),
            email: input.simpleFilter ? Like(`%${input.simpleFilter}%`) : undefined,
            role: input.roleFilter,
            externalServices: {
                id: input.externalServiceFilter ? In(input.externalServiceFilter) : undefined,
            },
            externalRoles: {
                id: input.externalRoleFilter ? In(input.externalRoleFilter) : undefined,
            },
        }

        const userEntityInstances = await this.userRepository.getAll(
            filter,
            sortInputListToFindOptionsOrderAdapter<UserEntity>(
                input.sort,
                Builder<UserEntity>()
                    .id(null).email(null).password(null)
                    .createdAt(null).updatedAt(null)
                    .verified(null).role(null)
                    .build(),
            ),
            input.page,
            input.perPage,
            {
                externalServices: {
                    externalRoles: true
                },
                externalRoles: {
                    externalService: true
                },
            },
        )

        const totalElements = await this.userRepository.count(filter)

        const userListAttributesBuilder = Builder<UserListAttributes>()
        userListAttributesBuilder
            .data(
                userEntityInstances
                    .map((userEntityInstance: UserEntity) => userEntityToUserAttributesDtoAdapter(userEntityInstance)),
            )
            .meta(
                Builder<ListMetaAttributes>()
                    .currentPage(input.page)
                    .elementsPerPage(input.perPage)
                    .totalElements(totalElements)
                    .totalPages(Math.ceil(totalElements / input.perPage))
                    .build(),
            )
        return userListAttributesBuilder.build()
    }

    async getOne(id: string): Promise<UserAttributes> {
        const user = await this.userRepository.getOne(
            { id: id },
            {
                externalServices: {
                    externalRoles: true
                },
                externalRoles: {
                    externalService: true
                },
            },
        )
        return userEntityToUserAttributesDtoAdapter(user)
    }

    /**
     * Check user roles and says which users can you update and create
     * */
    private checkPrivileges(role: ERole): ERole[] {
        if (role === ERole.Admin) {
            return [ERole.Moderator, ERole.User]
        } else if (role === ERole.Moderator) {
            return [ERole.User]
        } else {
            return []
        }
    }

    async create(
        input: UserCreateInput,
        role?: ERole,
    ): Promise<UserAttributes> {
        if (role) {
            const allowedRoles = this.checkPrivileges(role)

            if (!allowedRoles.includes(input.role)) {
                Builder(UniversalError)
                    .messages([
                        FORBIDDEN_ERROR_MESSAGE,
                        `You cant create user with ${role} role`,
                    ])
                    .exceptionBaseClass(EUniversalExceptionType.forbidden)
                    .build().throw()
            }
        }

        const userBuilder = Builder<UserEntity>()
        userBuilder
            .email(input.email)
            .password(await this.bcryptService.hash(input.password))
            .role(input.role).verified(input.verified)
        const createdUserEntityInstance = await this.userRepository.saveOne(userBuilder.build())

        return userEntityToUserAttributesDtoAdapter(createdUserEntityInstance)
    }

    async updateMethodRoleShell(
        userToUpdate: UserEntity,
        input: UserUpdatePayloadInput,
        role?: ERole,
    ) {
        if (!role) {
            return
        }

        const allowedRoles = this.checkPrivileges(role)

        /**Check for possibility of user update*/
        if (!allowedRoles.includes(userToUpdate.role)) {
            Builder(UniversalError)
                .messages([
                    FORBIDDEN_ERROR_MESSAGE,
                    'You cant update this user',
                ])
                .exceptionBaseClass(EUniversalExceptionType.forbidden)
                .build().throw()
        }

        /**Check for possibility to assign this role*/
        if (input.role && !allowedRoles.includes(input.role)) {
            Builder(UniversalError)
                .messages([
                    FORBIDDEN_ERROR_MESSAGE,
                    `You cant create user with ${input.role} role`,
                ])
                .exceptionBaseClass(EUniversalExceptionType.forbidden)
                .build().throw()
        }
    }

    async update(
        id: string,
        input: UserUpdatePayloadInput,
        role?: ERole,
    ): Promise<UserAttributes> {
        const userToUpdate = await this.userRepository.getOne({ id: id })

        /**Checking role requirements to this action*/
        await this.updateMethodRoleShell(userToUpdate,input,role)

        const externalServicesToUpdate = input.externalServicesId
            ? await this.externalServiceRepository.getAll({
                id: In(input.externalServicesId),
            })
            : undefined

        const externalRolesToUpdate = input.externalRolesId
            ? await this.externalRoleRepository.getAll({
                id: In(input.externalRolesId),
            })
            : undefined

        if (externalRolesToUpdate) {
            const externalServicesToUpdateId = externalServicesToUpdate?.map((item) => item.id) || []

            const userExternalServicesId = externalServicesToUpdate
                ? externalServicesToUpdate.map((item) => item.id)
                : userToUpdate.externalServices.map((item) => item.id)

            externalRolesToUpdate.forEach((item) => {
                if (![...userExternalServicesId, ...externalServicesToUpdateId].includes(item.externalServiceId)) {
                    Builder(UniversalError)
                        .messages([
                            CONFLICT_ERROR_MESSAGE,
                            'You cant assign to user roles which belongs to service where user doesnt exist',
                        ])
                        .exceptionBaseClass(EUniversalExceptionType.conflict)
                        .build().throw()
                }
            })
        }

        await this.userRepository.update(
            { id: id },
            Builder<UserEntity>()
                .email(input?.email || undefined)
                .password(input?.password ? await this.bcryptService.hash(input.password) : undefined)
                .role(input.role).verified(input?.verified || undefined)
                .externalServices(externalServicesToUpdate)
                .externalRoles(externalRolesToUpdate)
                .build(),
        )

        return await this.getOne(id)
    }

    async delete(
        id: string,
        role: ERole,
    ) {
        const userToDelete = await this.userRepository.getOne({ id: id })

        const allowedUsersToDelete = this.checkPrivileges(role)

        if (!allowedUsersToDelete.includes(userToDelete.role)) {
            Builder(UniversalError)
                .messages([
                    FORBIDDEN_ERROR_MESSAGE,
                    `You cant delete user with ${userToDelete.role} role`,
                ])
                .exceptionBaseClass(EUniversalExceptionType.forbidden)
                .build().throw()
        }

        await this.userRepository.delete({ id: id })
        return id
    }

    async updateMe(id: string, input: UserUpdateMeInput): Promise<UserAttributes> {
        await this.userRepository.update(
            { id: id },
            Builder<UserEntity>()
                .email(input?.email || undefined)
                .password(input?.password ? await this.bcryptService.hash(input.password) : undefined)
                .build(),
        )

        return await this.getOne(id)
    }

    async deleteMe(id: string): Promise<string> {
        await this.userRepository.delete({ id: id })

        return id
    }
}