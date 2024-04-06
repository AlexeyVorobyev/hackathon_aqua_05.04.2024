import { Inject, Injectable } from '@nestjs/common'
import { ExternalServiceRepository } from './repository/external-service.repository'
import { ExternalServiceListAttributes } from './attributes/external-service-list.attributes'
import { FindOptionsWhere, Like } from 'typeorm'
import { listInputToFindOptionsWhereAdapter } from '../graphql/adapter/list-input-to-find-options-where.adapter'
import { ExternalServiceListInput } from './input/external-service-list.input'
import { ExternalServiceEntity } from './entity/external-service.entity'
import { Builder } from 'builder-pattern'
import { ListMetaAttributes } from '../graphql/attributes/list-meta.attributes'
import {
    externalServiceEntityToExternalServiceAttributesAdapter,
} from './adapter/external-service-entity-to-external-service-attributes.adapter'
import { ExternalServiceAttributes } from './attributes/external-service.attributes'
import { ExternalServiceCreateInput } from './input/external-service-create.input'
import {
    sortInputListToFindOptionsOrderAdapter,
} from '../graphql/adapter/sort-input-list-to-find-options-order.adapter'
import {
    ExternalServiceUpdatePayloadInput,
} from './input/external-service-update-payload.input'

@Injectable()
export class ExternalServiceService {
    constructor(
        @Inject(ExternalServiceRepository)
        private externalServiceRepository: ExternalServiceRepository,
    ) {
    }

    async getAll(input: ExternalServiceListInput): Promise<ExternalServiceListAttributes> {
        const filter: FindOptionsWhere<ExternalServiceEntity>[] = ['name', 'description', 'recognitionKey'].map((item) => ({
            ...listInputToFindOptionsWhereAdapter<ExternalServiceEntity>(input),
            [item]: input.simpleFilter ? Like(`%${input.simpleFilter}%`) : undefined,
        }))

        const externalServiceEntityInstanceList = await this.externalServiceRepository.getAll(
            filter,
            sortInputListToFindOptionsOrderAdapter<ExternalServiceEntity>(
                input.sort,
                Builder<ExternalServiceEntity>()
                    .id(null).name(null).description(null)
                    .createdAt(null).updatedAt(null)
                    .recognitionKey(null)
                    .build(),
            ),
            input.page,
            input.perPage,
            {
                users: true,
                externalRoles: true,
            },
        )

        const totalElements = await this.externalServiceRepository.count(filter)

        const externalServiceListAttributesBuilder = Builder<ExternalServiceListAttributes>()
        externalServiceListAttributesBuilder
            .data(
                externalServiceEntityInstanceList
                    .map((item) => externalServiceEntityToExternalServiceAttributesAdapter(item)),
            )
            .meta(
                Builder<ListMetaAttributes>()
                    .currentPage(input.page)
                    .elementsPerPage(input.perPage)
                    .totalElements(totalElements)
                    .totalPages(Math.ceil(totalElements / input.perPage))
                    .build(),
            )
        return externalServiceListAttributesBuilder.build()
    }

    async getOne(id: string): Promise<ExternalServiceAttributes> {
        const externalService = await this.externalServiceRepository.getOne(
            { id: id },
            {
                users: true,
                externalRoles: true,
            },
        )
        return externalServiceEntityToExternalServiceAttributesAdapter(externalService)
    }

    async create(input: ExternalServiceCreateInput): Promise<ExternalServiceAttributes> {
        const externalServiceEntityBuilder = Builder<ExternalServiceEntity>()

        externalServiceEntityBuilder
            .name(input.name)
            .description(input.description)
            .recognitionKey(input.recognitionKey)

        return await this.externalServiceRepository.saveOne(externalServiceEntityBuilder.build())
    }

    async update(id: string, input: ExternalServiceUpdatePayloadInput): Promise<ExternalServiceAttributes> {
        await this.externalServiceRepository.update(
            { id: id },
            Builder<ExternalServiceEntity>()
                .recognitionKey(input.recognitionKey)
                .description(input.description)
                .name(input.name)
                .build(),
        )

        return await this.getOne(id)
    }

    async delete(id: string): Promise<string> {
        await this.externalServiceRepository.delete({ id: id })
        return id
    }
}