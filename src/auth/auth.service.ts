import { User } from '../user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  async generateToken(user: User) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
}