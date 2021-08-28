import { Body, Controller, Get, HttpCode, Param, Post, Request } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { SETTINGS } from 'src/app.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiOkResponse({ type: ReturnUserDto, isArray: true, description: "list of all users" })
    @Get()
    getUsers(): Promise<ReturnUserDto[]> {
        return this.usersService.getAll();
    }

    @ApiOkResponse({ type: ReturnUserDto, isArray: false, description: "a specific user" })
    @Get(':id')
    getUserById(@Param('id') id: string): Promise<ReturnUserDto> {
        return this.usersService.getOneById(Number(id));
    }

    @ApiCreatedResponse({ type: ReturnUserDto })
    @Post('/register')
    async createUser(@Body(SETTINGS.VALIDATION_PIPE) body: CreateUserDto): Promise<ReturnUserDto> {
        return await this.usersService.createUser(body);
    }

    @ApiOkResponse({ type: Object })
    @Post('/login')
    @HttpCode(200)
    async login(@Body() loginUserDto: LoginUserDto): Promise<Object> {
        const jwt = await this.usersService.login(loginUserDto);
        return {
            access_token: jwt,
            token_type: 'JWT',
            expires_in: 100000
        };
    }
}
