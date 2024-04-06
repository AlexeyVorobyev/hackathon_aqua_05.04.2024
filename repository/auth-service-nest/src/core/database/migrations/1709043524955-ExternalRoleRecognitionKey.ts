import { MigrationInterface, QueryRunner } from "typeorm";

export class ExternalRoleRecognitionKey1709043524955 implements MigrationInterface {
    name = 'ExternalRoleRecognitionKey1709043524955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_role" ADD "recognition_key" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "external_role" ADD CONSTRAINT "UQ_4d244f0a5a85326cd59435622e2" UNIQUE ("recognition_key")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_role" DROP CONSTRAINT "UQ_4d244f0a5a85326cd59435622e2"`);
        await queryRunner.query(`ALTER TABLE "external_role" DROP COLUMN "recognition_key"`);
    }

}
