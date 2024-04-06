import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1708846727425 implements MigrationInterface {
    name = 'Initial1708846727425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "external_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "external_service_id" uuid, "user_id" uuid, CONSTRAINT "PK_b1188610d12a777916fb8f75ead" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "external_service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "recognition_key" character varying NOT NULL, CONSTRAINT "UQ_9f4908eec71b53bcb8816af5ba6" UNIQUE ("recognition_key"), CONSTRAINT "PK_4507eb836b2a4d75a4bc97afe53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_external_service" ("user_id" uuid NOT NULL, "external_service_id" uuid NOT NULL, CONSTRAINT "PK_7148ef97c2c53582574d020ab6f" PRIMARY KEY ("user_id", "external_service_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1ab14c41aab4b66f578bbada0e" ON "user_external_service" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_035a43c945ad57d74139d1b90f" ON "user_external_service" ("external_service_id") `);
        await queryRunner.query(`ALTER TABLE "external_role" ADD CONSTRAINT "FK_52839e18c8296c5a3a11483819d" FOREIGN KEY ("external_service_id") REFERENCES "external_service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "external_role" ADD CONSTRAINT "FK_a6f6cf605529b34dd1fb02e54c6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_external_service" ADD CONSTRAINT "FK_1ab14c41aab4b66f578bbada0e4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_external_service" ADD CONSTRAINT "FK_035a43c945ad57d74139d1b90f8" FOREIGN KEY ("external_service_id") REFERENCES "external_service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_external_service" DROP CONSTRAINT "FK_035a43c945ad57d74139d1b90f8"`);
        await queryRunner.query(`ALTER TABLE "user_external_service" DROP CONSTRAINT "FK_1ab14c41aab4b66f578bbada0e4"`);
        await queryRunner.query(`ALTER TABLE "external_role" DROP CONSTRAINT "FK_a6f6cf605529b34dd1fb02e54c6"`);
        await queryRunner.query(`ALTER TABLE "external_role" DROP CONSTRAINT "FK_52839e18c8296c5a3a11483819d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_035a43c945ad57d74139d1b90f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1ab14c41aab4b66f578bbada0e"`);
        await queryRunner.query(`DROP TABLE "user_external_service"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "external_service"`);
        await queryRunner.query(`DROP TABLE "external_role"`);
    }

}
