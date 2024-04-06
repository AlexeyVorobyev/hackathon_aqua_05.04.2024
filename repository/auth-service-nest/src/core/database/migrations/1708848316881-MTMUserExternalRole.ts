import { MigrationInterface, QueryRunner } from "typeorm";

export class MTMUserExternalRole1708848316881 implements MigrationInterface {
    name = 'MTMUserExternalRole1708848316881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_role" DROP CONSTRAINT "FK_a6f6cf605529b34dd1fb02e54c6"`);
        await queryRunner.query(`CREATE TABLE "user_external_role" ("user_id" uuid NOT NULL, "external_role_id" uuid NOT NULL, CONSTRAINT "PK_c9ae7f3df1576593578a616f03f" PRIMARY KEY ("user_id", "external_role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b8956a66c40898a893640bfd3a" ON "user_external_role" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a7b830bb51daf5135941bac831" ON "user_external_role" ("external_role_id") `);
        await queryRunner.query(`ALTER TABLE "external_role" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_external_role" ADD CONSTRAINT "FK_b8956a66c40898a893640bfd3ab" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_external_role" ADD CONSTRAINT "FK_a7b830bb51daf5135941bac831c" FOREIGN KEY ("external_role_id") REFERENCES "external_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_external_role" DROP CONSTRAINT "FK_a7b830bb51daf5135941bac831c"`);
        await queryRunner.query(`ALTER TABLE "user_external_role" DROP CONSTRAINT "FK_b8956a66c40898a893640bfd3ab"`);
        await queryRunner.query(`ALTER TABLE "external_role" ADD "user_id" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a7b830bb51daf5135941bac831"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8956a66c40898a893640bfd3a"`);
        await queryRunner.query(`DROP TABLE "user_external_role"`);
        await queryRunner.query(`ALTER TABLE "external_role" ADD CONSTRAINT "FK_a6f6cf605529b34dd1fb02e54c6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
