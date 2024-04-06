import { MigrationInterface, QueryRunner } from "typeorm";

export class ExternalServiceConstraint1709038545697 implements MigrationInterface {
    name = 'ExternalServiceConstraint1709038545697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_role" DROP CONSTRAINT "FK_52839e18c8296c5a3a11483819d"`);
        await queryRunner.query(`ALTER TABLE "external_role" ALTER COLUMN "external_service_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "external_role" ADD CONSTRAINT "FK_52839e18c8296c5a3a11483819d" FOREIGN KEY ("external_service_id") REFERENCES "external_service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_role" DROP CONSTRAINT "FK_52839e18c8296c5a3a11483819d"`);
        await queryRunner.query(`ALTER TABLE "external_role" ALTER COLUMN "external_service_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "external_role" ADD CONSTRAINT "FK_52839e18c8296c5a3a11483819d" FOREIGN KEY ("external_service_id") REFERENCES "external_service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
