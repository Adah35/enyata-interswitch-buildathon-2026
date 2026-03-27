import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1774580881325 implements MigrationInterface {
    name = 'Init1774580881325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('POSTER', 'TASKER', 'BOTH', 'ADMIN')`);
        await queryRunner.query(`CREATE TYPE "public"."users_kyclevel_enum" AS ENUM('NONE', 'BASIC', 'ID_VERIFIED', 'PAYOUT')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, "kycLevel" "public"."users_kyclevel_enum" NOT NULL DEFAULT 'NONE', "nin" character varying, "bvn" character varying, "passportUrl" text, "isPhoneVerified" boolean NOT NULL DEFAULT false, "isEmailVerified" boolean NOT NULL DEFAULT false, "avatarUrl" text, "bio" text, "bankCode" character varying, "accountNumber" character varying, "accountName" character varying, "totalTasksPosted" integer NOT NULL DEFAULT '0', "totalTasksDone" integer NOT NULL DEFAULT '0', "avgRatingAsTasker" double precision, "avgRatingAsPoster" double precision, "lastLoginAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_79f100537f2bf20399f5e749c79" UNIQUE ("nin"), CONSTRAINT "UQ_3793c0643b7da6de6a9b7c3d897" UNIQUE ("bvn"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "icon" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('DRAFT', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_REVIEW', 'COMPLETED', 'CANCELLED', 'REFUNDED')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "posterId" uuid NOT NULL, "taskerId" uuid, "categoryId" uuid, "title" character varying NOT NULL, "description" text NOT NULL, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'DRAFT', "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "locationDisplay" character varying NOT NULL, "locationExact" text NOT NULL, "budgetKobo" bigint NOT NULL, "finalPriceKobo" bigint, "mediaUrls" text array NOT NULL DEFAULT '{}', "scheduledFor" TIMESTAMP, "durationEstimate" character varying, "completionProofUrls" text array NOT NULL DEFAULT '{}', "completedAt" TIMESTAMP, "confirmedAt" TIMESTAMP, "autoReleaseAt" TIMESTAMP, "cancelledAt" TIMESTAMP, "cancelReason" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."escrow_accounts_status_enum" AS ENUM('HOLDING', 'RELEASED', 'REFUNDED', 'DISPUTED')`);
        await queryRunner.query(`CREATE TABLE "escrow_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid NOT NULL, "posterUserId" uuid NOT NULL, "taskerUserId" uuid, "grossAmountKobo" bigint NOT NULL, "platformFeeKobo" bigint NOT NULL, "taskerCommissionKobo" bigint NOT NULL, "netPayoutKobo" bigint NOT NULL, "iswTransactionRef" character varying, "iswPaymentRef" character varying, "iswTransferRef" character varying, "iswRefundRef" character varying, "status" "public"."escrow_accounts_status_enum" NOT NULL DEFAULT 'HOLDING', "heldAt" TIMESTAMP, "autoReleaseAt" TIMESTAMP, "releasedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f87ba846c2bdff4933621801beb" UNIQUE ("taskId"), CONSTRAINT "UQ_ea36ce3d9ac74dfc50ff02750d8" UNIQUE ("iswTransactionRef"), CONSTRAINT "REL_f87ba846c2bdff4933621801be" UNIQUE ("taskId"), CONSTRAINT "PK_4d065b88217295bb812ff7b2af2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('CHARGE', 'TASKER_PAYOUT', 'PLATFORM_FEE', 'REFUND')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('PENDING', 'SUCCESS', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" character varying NOT NULL, "escrowId" uuid, "userId" uuid NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "amountKobo" bigint NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'PENDING', "iswReference" character varying, "iswResponseCode" character varying, "idempotencyKey" character varying NOT NULL, "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_86238dd0ae2d79be941104a5842" UNIQUE ("idempotencyKey"), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "userId" uuid NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid NOT NULL, "raterId" uuid NOT NULL, "rateeId" uuid NOT NULL, "score" integer NOT NULL, "reviewText" text, "isVisible" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e8e0c677603c1a758f54d95473f" UNIQUE ("taskId", "raterId"), CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payouts_status_enum" AS ENUM('PENDING', 'SUCCESS', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "payouts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskerId" uuid NOT NULL, "taskId" character varying NOT NULL, "amountKobo" bigint NOT NULL, "bankCode" character varying NOT NULL, "accountNumber" character varying NOT NULL, "accountName" character varying NOT NULL, "status" "public"."payouts_status_enum" NOT NULL DEFAULT 'PENDING', "iswTransferRef" character varying, "iswResponseCode" character varying, "failureReason" text, "retryCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_76855dc4f0a6c18c72eea302e87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('TASK_BID_RECEIVED', 'TASK_BID_ACCEPTED', 'TASK_BID_REJECTED', 'TASK_ASSIGNED', 'TASK_STARTED', 'TASK_COMPLETED', 'TASK_CONFIRMED', 'TASK_CANCELLED', 'PAYMENT_CONFIRMED', 'PAYOUT_SENT', 'PAYOUT_FAILED', 'DISPUTE_OPENED', 'DISPUTE_RESOLVED', 'REVIEW_RECEIVED')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "title" character varying NOT NULL, "body" text NOT NULL, "data" jsonb, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."messages_sendertype_enum" AS ENUM('USER', 'SYSTEM')`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid NOT NULL, "senderId" uuid NOT NULL, "senderType" "public"."messages_sendertype_enum" NOT NULL DEFAULT 'USER', "content" text NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bids_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')`);
        await queryRunner.query(`CREATE TABLE "bids" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid NOT NULL, "taskerId" uuid NOT NULL, "amountKobo" bigint NOT NULL, "message" text, "status" "public"."bids_status_enum" NOT NULL DEFAULT 'PENDING', "acceptedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_14d5012b8f51250722186d7c6f6" UNIQUE ("taskId", "taskerId"), CONSTRAINT "PK_7950d066d322aab3a488ac39fe5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."disputes_reason_enum" AS ENUM('INCOMPLETE', 'POOR_QUALITY', 'NO_SHOW', 'FRAUD', 'PAYMENT_ISSUE')`);
        await queryRunner.query(`CREATE TYPE "public"."disputes_status_enum" AS ENUM('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED')`);
        await queryRunner.query(`CREATE TYPE "public"."disputes_resolution_enum" AS ENUM('TASKER_WINS', 'POSTER_WINS')`);
        await queryRunner.query(`CREATE TABLE "disputes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid NOT NULL, "escrowId" uuid, "filedById" uuid NOT NULL, "reason" "public"."disputes_reason_enum" NOT NULL, "description" text NOT NULL, "evidenceUrls" text array NOT NULL DEFAULT '{}', "status" "public"."disputes_status_enum" NOT NULL DEFAULT 'OPEN', "resolution" "public"."disputes_resolution_enum", "resolvedById" uuid, "resolutionNotes" text, "resolvedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3686d83791bbd0303e4c99b8aac" UNIQUE ("taskId"), CONSTRAINT "REL_3686d83791bbd0303e4c99b8aa" UNIQUE ("taskId"), CONSTRAINT "PK_3c97580d01c1a4b0b345c42a107" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_420dd8c30ff52f8d3c5a8a5c54c" FOREIGN KEY ("posterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_db0a3c43fe530d088c5a20d8603" FOREIGN KEY ("taskerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_8ae9301033f772a42330e917a7d" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "escrow_accounts" ADD CONSTRAINT "FK_f87ba846c2bdff4933621801beb" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "escrow_accounts" ADD CONSTRAINT "FK_9e48d7402190c38d51c7f595387" FOREIGN KEY ("posterUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "escrow_accounts" ADD CONSTRAINT "FK_342e55a4f9df33b35b68d901166" FOREIGN KEY ("taskerUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_4288118d2b3d200a1a76ff483d9" FOREIGN KEY ("escrowId") REFERENCES "escrow_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_cb300f7c8a62eb3f1e394ce4c6c" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_e5d0a61e726410a860f23f39de7" FOREIGN KEY ("raterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_dc83bc48cfaaa56920a68da24ff" FOREIGN KEY ("rateeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payouts" ADD CONSTRAINT "FK_8bd126a002281613cc0435d82c8" FOREIGN KEY ("taskerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_fd2c4496fbb610e44408e279537" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bids" ADD CONSTRAINT "FK_321466d16eac3eaab3ee580a8d0" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bids" ADD CONSTRAINT "FK_3dc3c5f1996487250041753a504" FOREIGN KEY ("taskerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "disputes" ADD CONSTRAINT "FK_3686d83791bbd0303e4c99b8aac" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "disputes" ADD CONSTRAINT "FK_2a98fa520e11b091021b70c6be9" FOREIGN KEY ("filedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "disputes" DROP CONSTRAINT "FK_2a98fa520e11b091021b70c6be9"`);
        await queryRunner.query(`ALTER TABLE "disputes" DROP CONSTRAINT "FK_3686d83791bbd0303e4c99b8aac"`);
        await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "FK_3dc3c5f1996487250041753a504"`);
        await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "FK_321466d16eac3eaab3ee580a8d0"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_fd2c4496fbb610e44408e279537"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
        await queryRunner.query(`ALTER TABLE "payouts" DROP CONSTRAINT "FK_8bd126a002281613cc0435d82c8"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_dc83bc48cfaaa56920a68da24ff"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_e5d0a61e726410a860f23f39de7"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_cb300f7c8a62eb3f1e394ce4c6c"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_4288118d2b3d200a1a76ff483d9"`);
        await queryRunner.query(`ALTER TABLE "escrow_accounts" DROP CONSTRAINT "FK_342e55a4f9df33b35b68d901166"`);
        await queryRunner.query(`ALTER TABLE "escrow_accounts" DROP CONSTRAINT "FK_9e48d7402190c38d51c7f595387"`);
        await queryRunner.query(`ALTER TABLE "escrow_accounts" DROP CONSTRAINT "FK_f87ba846c2bdff4933621801beb"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_8ae9301033f772a42330e917a7d"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_db0a3c43fe530d088c5a20d8603"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_420dd8c30ff52f8d3c5a8a5c54c"`);
        await queryRunner.query(`DROP TABLE "disputes"`);
        await queryRunner.query(`DROP TYPE "public"."disputes_resolution_enum"`);
        await queryRunner.query(`DROP TYPE "public"."disputes_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."disputes_reason_enum"`);
        await queryRunner.query(`DROP TABLE "bids"`);
        await queryRunner.query(`DROP TYPE "public"."bids_status_enum"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TYPE "public"."messages_sendertype_enum"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TABLE "payouts"`);
        await queryRunner.query(`DROP TYPE "public"."payouts_status_enum"`);
        await queryRunner.query(`DROP TABLE "ratings"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "escrow_accounts"`);
        await queryRunner.query(`DROP TYPE "public"."escrow_accounts_status_enum"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_kyclevel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
