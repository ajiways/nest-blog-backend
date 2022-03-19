import {MigrationInterface, QueryRunner} from "typeorm";

export class MarkdownField1647656073838 implements MigrationInterface {
    name = 'MarkdownField1647656073838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts"
            ADD "markdown" text NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts" DROP COLUMN "markdown"
        `);
    }

}
