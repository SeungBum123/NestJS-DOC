import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/models/users/entity/users.entity";
import { EntityManager, getManager, Repository } from "typeorm";
import { AuthEmail } from "../entity/email.entity";

@Injectable()
export class EmailRepository{
    constructor(
        @InjectRepository(User, 'testDB_1')
        private usersRepository: Repository<User>,

        @InjectRepository(AuthEmail, 'testDB_1')
        private emailRepository: Repository<AuthEmail>,
    ){}

    async emailInfo(no) {
        try {
            const emailInfo = await this.emailRepository.createQueryBuilder('auth_email')
            .select(
                [
                    'auth_email.no AS EmailNo', 
                    `CONVERT_TZ(auth_email.sendedAt, '+00:00', '+09:00') AS emailSendedAt`
                ]
            )
            .where('auth_email.user_no = :no', {no})
            .orderBy('auth_email.sendedAt', 'DESC')
            .getRawOne();
            
            return emailInfo;
        } catch (err) {
            throw err;
        }
    }

    async createSendEmail(user_no, uuid, sendedAt) {        
        const result = await this.emailRepository.createQueryBuilder('auth_email')
        .insert()
        .into(AuthEmail)
        .values({
            uuid,
            sendedAt,
            user_no
        })
        .execute();
        
        return result.raw;
    }

    async uuidVerification(uuid) {
        try {
            return await this.emailRepository.createQueryBuilder('auth_email')
            .leftJoin('auth_email.user_no','user')
            .select(['user.no AS userNo'])
            .where('auth_email.uuid = :uuid',{uuid})
            .getRawOne();
        } catch (err) {
            throw err;
        }
    }

    async activeConfirm(uuid) {
        try {
            return await this.emailRepository.createQueryBuilder('auth_email')
            .select(['auth_email.no'])
            .where('auth_email.uuid = uuid', {uuid})
            .getOne();

        } catch (err) {
            throw err;
        }
    }
}