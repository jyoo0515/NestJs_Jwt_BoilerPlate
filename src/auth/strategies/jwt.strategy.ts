import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: (req: Request) => {
                let token = null;
                if (req && req.cookies)
                    token = req.cookies['access_token'];
                return token;
            },
            ignoreExpiration: false,
            secretOrKey: configService.get('TOKEN_KEY'), // protect this using environment variable
        })
    }

    async validate(payload: any) {
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}