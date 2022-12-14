import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import * as nodeMailer from 'nodemailer';
import { DataSource } from 'typeorm';
import * as uuid from 'uuid';
import { UsersRepository } from '../users/repository/users.repository';
import { EmailRepository } from './Repository/email.repository';

@Injectable()
export class EmailService {
    constructor(
        private readonly configService: ConfigService,
        private readonly emailRepository: EmailRepository,
        private readonly usersRepository: UsersRepository,

        @InjectDataSource('testDB_1')
        private dataSource: DataSource
    ){}

    async emailAuth(email) {
        try {
            const currentDate = new Date();
            const secret = uuid.v1();
            const url = this.configService.get<string>('URL');
            
            const userInfo = await this.usersRepository.userConfirm(email);
            if (!userInfo) {
                throw new NotFoundException(1000);
            }
        
            // 마지막 이메일 전송내역 가져오기
            const sendEmailInfo = await this.emailRepository.emailInfo(userInfo.no);
            
            // 이메일 발송시간 제한 (처음 인증메일을 보낼때 제한시간 상관 X)
            if (sendEmailInfo !== undefined) {
                const emailSendedAt = new Date(sendEmailInfo.emailSendedAt);
                emailSendedAt.setMinutes(emailSendedAt.getMinutes() + 1);
                if (currentDate <= emailSendedAt) {
                    throw new BadRequestException(1006);
                };
            }
            
            
            const transporter = nodeMailer.createTransport({
                service: this.configService.get<string>('EMAIL_SERVICE'),
                auth: {
                    user: this.configService.get<string>('EMAIL_ID'),
                    pass: this.configService.get<string>('EMAIL_PASSWORD')
                }
            })

            const mailOptions = {
                to: email,
                subject:'이메일 인증 메일',
                html: `
                가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
                <form action="${url}/${secret}" method="GET">
                <button>가입확인</button>
                </form>  
                `,
            }
            await transporter.sendMail(mailOptions);

            await this.emailRepository.createSendEmail(userInfo.no, secret, currentDate);
        } catch (err) {
            throw err;
        } 
    }
}
