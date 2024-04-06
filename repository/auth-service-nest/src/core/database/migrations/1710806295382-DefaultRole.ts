import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultRole1710806295382 implements MigrationInterface {
    name = 'DefaultRole1710806295382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_role" ADD "default" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_role" DROP COLUMN "default"`);
    }

}
