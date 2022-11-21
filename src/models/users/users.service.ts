import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/models/auth/auth.service';
import { UsersRepository } from './repository/users.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly authService: AuthService,
    ){}

    async signIn({email, password}) {
        try {
            const userInfo = await this.usersRepository.signIn(email);
            
            if (userInfo === null) {
                throw new NotFoundException(1000);
            }

            const {no, salt, active} = userInfo;

            const passwordConfirm = await bcrypt.compare(password, salt);
            
            if (!passwordConfirm) {
                throw new UnauthorizedException(1003);
            }

            if (!active) {
                throw new UnauthorizedException(1005);
            }
            
            const accessToken = await this.authService.issuanceToken({no, email},
                {
                    key: 'ACCESS_KEY', 
                    expiresin: 'ACCESS_KEY_EXPIRESIN'
                }
            );
            const refreshToken = await this.authService.issuanceToken({no, email}, 
                {
                    key: 'REFRESH_KEY', 
                    expiresin: 'REFRESH_KEY_EXPIRESIN'
                }
            );
            
            await this.usersRepository.refreshToken(email, refreshToken);

            return {accessToken, refreshToken};
        } catch (err) {
            throw err;
        }
    }

    async signUp(signUpDto) {
        try {
            const emailConfirm = await this.usersRepository.emailConfirm(signUpDto.email);
            if (emailConfirm) {
                throw new BadRequestException(1001);
            }

            const salts = await bcrypt.genSalt();
            signUpDto.password = await bcrypt.hash(signUpDto.password, salts);

            await this.usersRepository.signUp(signUpDto);
        } catch (err) {
            throw err;
        }
    }

    async userInfo(no:number) {
        try {
            const userInfo = await this.usersRepository.userInfo(no);

            return userInfo;
        } catch (err) {
            throw err;
        }
    }

    async emailVerification(uuid:string) {
        try {
            const {active} = await this.usersRepository.activeConfirm(uuid)
            if (active) {
                throw new BadRequestException(1007);
            }
            
            await this.usersRepository.emailVerification(uuid);
        } catch (err) {
            throw err;
        }
    }
}
