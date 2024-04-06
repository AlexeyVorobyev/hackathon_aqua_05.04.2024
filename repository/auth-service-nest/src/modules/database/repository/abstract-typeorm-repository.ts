import { IRepository } from '../interface/repository.interface'
import { FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm'
import { instanceToPlain } from 'class-transformer'
import { Builder } from 'builder-pattern'
import { UniversalError } from '../../common/class/universal-error'
import { EUniversalExceptionType } from '../../common/enum/exceptions'
import { EPostgreSQLErrorCode } from '../enum/postgresql-error-code.enum'

export abstract class AbstractTypeormRepository<Entity> implements IRepository<Entity, FindOptionsWhere<Entity>, FindOptionsOrder<Entity>> {
	protected constructor(
		readonly typeormRepository: Repository<Entity>
	) {
	}
	async getAll(
		filter?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
		order?: FindOptionsOrder<Entity>,
		page?: number,
		perPage?: number,
		relations?: FindOptionsRelations<Entity>
	): Promise<Entity[]> {
		return await this.typeormRepository.find({
			where: filter || undefined,
			order: order || undefined,
			skip: page * perPage || undefined,
			take: perPage || undefined,
			relationLoadStrategy: 'query',
			relations: relations
		})
	}

	async getOne(filter?: FindOptionsWhere<Entity>, relations?: FindOptionsRelations<Entity>): Promise<Entity> {
		const entityInstance = await this.typeormRepository.findOne({
			where: filter || undefined,
			relations: relations
		})
		if (!entityInstance) {
			Builder(UniversalError)
				.messages(['Entity not found'])
				.exceptionBaseClass(EUniversalExceptionType.badRequest)
				.build().throw()
		}
		return entityInstance
	}

	async count(filter?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]): Promise<number> {
		return await this.typeormRepository.count({
			where: filter || undefined
		})
	}

	async saveOne(entity: Entity): Promise<Entity> {
		try {
			return await this.typeormRepository.save(entity)
		} catch (error) {
			if (error.code === EPostgreSQLErrorCode.uniqueViolation) {
				Builder(UniversalError)
					.messages([
						`Entity with provided fields already exist`,
						error?.detail
					])
					.exceptionBaseClass(EUniversalExceptionType.conflict)
					.build().throw()
			}
			else {
				Builder(UniversalError)
					.messages([
						`Internal server error`,
						error?.message
					])
					.exceptionBaseClass(EUniversalExceptionType.server)
					.build().throw()
			}
		}
	}

	async saveAll(entities: Entity[]): Promise<Entity[]> {
		return await this.typeormRepository.save(entities)
	}

	async update(
		filter: FindOptionsWhere<Entity>,
		entity: Partial<Entity>
	): Promise<void> {
		await this.getOne(filter)
		await this.typeormRepository.update(filter, instanceToPlain(entity))
	}

	async delete(filter: FindOptionsWhere<Entity>): Promise<void> {
		await this.getOne(filter)
		try {
			await this.typeormRepository.delete(filter)
		} catch (error) {
			if (error.code === EPostgreSQLErrorCode.foreignKeyViolation) {
				Builder(UniversalError)
					.messages([
						`Command violates foreign key reference`,
						error?.detail
					])
					.exceptionBaseClass(EUniversalExceptionType.conflict)
					.build().throw()
			}
			else {
				Builder(UniversalError)
					.messages([
						`Internal server error`,
						error?.message
					])
					.exceptionBaseClass(EUniversalExceptionType.server)
					.build().throw()
			}
		}
	}
}