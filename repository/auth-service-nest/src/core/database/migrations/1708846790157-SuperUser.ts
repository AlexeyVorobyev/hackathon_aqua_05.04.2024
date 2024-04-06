import { MigrationInterface, QueryRunner } from "typeorm";
import { BcryptService } from '../../../modules/bcrypt/bcrypt.service'
import { ERole } from '../../../modules/common/enum/role.enum'

const bcryptService = new BcryptService()

export class SuperUser1708846790157 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await bcryptService.hash(process.env.ADMIN_PASSWORD)
        await queryRunner.query(
            `
                INSERT INTO public.user (email, password, role)
                VALUES ($1, $2, $3);
            `,
            [process.env.ADMIN_EMAIL, hashedPassword, ERole.Admin],
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`TRUNCATE public.user`)
    }

}
