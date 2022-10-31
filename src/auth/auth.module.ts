import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshStrategy } from 'src/strategies/auth.jwt-refresh.strategy';
import { JwtStrategy } from 'src/strategies/auth.jwt.strategy';
import { User } from 'src/users/entity/users.entity';
import { UsersRepository } from 'src/users/repository/users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User], 'testDB_1')],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy,  JwtService,  RefreshStrategy, UsersRepository],
  exports: [AuthService]
})
export class AuthModule {}
