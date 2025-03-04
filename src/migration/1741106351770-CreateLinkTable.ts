import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLinkTable1741106351770 implements MigrationInterface {
    name = 'CreateLinkTable1741106351770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."link_status_enum" AS ENUM('pending', 'linked')`);
        await queryRunner.query(`CREATE TABLE "link" ("id" SERIAL NOT NULL, "status" "public"."link_status_enum" NOT NULL DEFAULT 'pending', "user_1_token" character varying, "user_2_token" character varying, CONSTRAINT "UQ_44f0134f0f08c967f9ef8044470" UNIQUE ("user_1_token", "user_2_token"), CONSTRAINT "PK_26206fb7186da72fbb9eaa3fac9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_df25be090eac337de3d9069d0ed" FOREIGN KEY ("user_1_token") REFERENCES "user"("userToken") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_8d851062076d901c79059aa1942" FOREIGN KEY ("user_2_token") REFERENCES "user"("userToken") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_8d851062076d901c79059aa1942"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_df25be090eac337de3d9069d0ed"`);
        await queryRunner.query(`DROP TABLE "link"`);
        await queryRunner.query(`DROP TYPE "public"."link_status_enum"`);
    }

}
