import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    // async validateUser(username: string, password: string): Promise<any> {
    //     const user = await this.usersService.getOneByUsername(username);
    //     if (user) {
    //         const isMatch = await bcrypt.compare(password, user.password);
    //         if (isMatch) {
    //             const { password, username, ...rest } = user;
    //             return rest;
    //         }
    //     }
    //     return null;
    // }
    comparePassword(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword);
    }

    generateJwt(user: any) {
        const payload = { email: user.email, sub: user.id };

        // return {
        //     access_token: this.jwtService.signAsync(payload)
        // };
        return this.jwtService.signAsync(payload);
    }
}
