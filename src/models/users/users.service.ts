import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/models/auth/auth.service';
import { UsersRepository } from './repository/users.repository';
@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly authService: AuthService,
    ){}

    async signIn({id, psword}) {
        try {
            const userInfo = await this.usersRepository.signIn(id);
            
            if (userInfo === null) {
                throw new NotFoundException(1000);
            }

            const {email, password} = userInfo;
            if (psword !== password) {
                throw new UnauthorizedException(1003)
            }
            
            const {accessToken} = await this.authService.issuanceToken(email, id, 'AccessToken');
            const {refreshToken} = await this.authService.issuanceToken(email, null, 'RefreshToken');

            await this.usersRepository.refreshToken(id, refreshToken);

            return {accessToken, refreshToken};
        } catch (err) {
            throw err;
        }
    }
}
