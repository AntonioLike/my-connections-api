import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorEntities1752231720057 implements MigrationInterface {
    name = 'RefactorEntities1752231720057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_df25be090eac337de3d9069d0ed"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_8d851062076d901c79059aa1942"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "UQ_44f0134f0f08c967f9ef8044470"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "user_1_token"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "user_2_token"`);
        await queryRunner.query(`ALTER TABLE "link" ADD "user1_token" character varying`);
        await queryRunner.query(`ALTER TABLE "link" ADD "user2_token" character varying`);
        await queryRunner.query(`ALTER TABLE "user_card_response" DROP CONSTRAINT "FK_f6a8a59d9ac89b4a9773e76296f"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_dfe0fd58bb994b43ce3a0f90ed3" PRIMARY KEY ("userToken")`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_dfe0fd58bb994b43ce3a0f90ed3"`);
        await queryRunner.query(`ALTER TABLE "user_card_response" ALTER COLUMN "response" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "UQ_608fe0ca152013b899f1622d10a" UNIQUE ("user1_token", "user2_token")`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_0362d98d3ed650234e84a43398d" FOREIGN KEY ("user1_token") REFERENCES "user"("userToken") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_eca0125d8af631ae5558c8ec5fd" FOREIGN KEY ("user2_token") REFERENCES "user"("userToken") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_card_response" ADD CONSTRAINT "FK_f6a8a59d9ac89b4a9773e76296f" FOREIGN KEY ("user_token") REFERENCES "user"("userToken") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_card_response" DROP CONSTRAINT "FK_f6a8a59d9ac89b4a9773e76296f"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_eca0125d8af631ae5558c8ec5fd"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_0362d98d3ed650234e84a43398d"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "UQ_608fe0ca152013b899f1622d10a"`);
        await queryRunner.query(`ALTER TABLE "user_card_response" ALTER COLUMN "response" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_dfe0fd58bb994b43ce3a0f90ed3" UNIQUE ("userToken")`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_dfe0fd58bb994b43ce3a0f90ed3"`);
        await queryRunner.query(`ALTER TABLE "user_card_response" ADD CONSTRAINT "FK_f6a8a59d9ac89b4a9773e76296f" FOREIGN KEY ("user_token") REFERENCES "user"("userToken") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "user2_token"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "user1_token"`);
        await queryRunner.query(`ALTER TABLE "link" ADD "user_2_token" character varying`);
        await queryRunner.query(`ALTER TABLE "link" ADD "user_1_token" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "UQ_44f0134f0f08c967f9ef8044470" UNIQUE ("user_1_token", "user_2_token")`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_8d851062076d901c79059aa1942" FOREIGN KEY ("user_2_token") REFERENCES "user"("userToken") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_df25be090eac337de3d9069d0ed" FOREIGN KEY ("user_1_token") REFERENCES "user"("userToken") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
