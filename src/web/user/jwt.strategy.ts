import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface UserInfo {
  id: number;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'hzihhuang-web', // 必须和 `JwtModule` 里的 secret 一致
    });
  }

  async validate(payload: any) {
    return { id: payload.id, tokenVersion: payload.tokenVersion };
  }
}
