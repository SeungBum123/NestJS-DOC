import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      //Request에서 JWT 토큰을 추출하는 방법을 설정 -> Authorization에서 Bearer Token에 JWT 토큰을 담아 전송해야한다.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
      ignoreExpiration: false,
      //검증 비밀 값(유출 주위)
      secretOrKey: 'SECRET_KEY'
    });
  }

  // 함수명은 꼭 validate를 써주어야 한다. 다른 함수명은 오류!
  async validate(payload) {
    try {
      return payload;
    } catch (err) {
      throw err;
    }
  }
}