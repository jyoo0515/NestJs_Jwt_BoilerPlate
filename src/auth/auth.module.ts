import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [PassportModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('TOKEN_KEY'),
      signOptions: { expiresIn: configService.get('TOKEN_EXPIRY') }
    })
  })],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
