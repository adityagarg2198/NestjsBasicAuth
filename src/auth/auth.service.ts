import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserInput } from './dto/login-user-input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const isValid = await bcrypt.compare(password, user.password);
    if (user && isValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginUserInput: LoginUserInput) {
    const user = await this.usersService.findOne(loginUserInput.username);
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
      user: user,
    };
  }

  async signup(loginUserInput: LoginUserInput) {
    const user = await this.usersService.findOne(loginUserInput.username);
    if (user) {
      throw new Error('User already exists');
    }
    const hashPassword = await bcrypt.hash(loginUserInput.password, 10);
    return this.usersService.create({
      ...loginUserInput,
      password: hashPassword,
    });
  }
}
