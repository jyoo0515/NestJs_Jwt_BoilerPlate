import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { SETTINGS } from 'src/app.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { Token } from './dto/token';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiOkResponse({ type: ReturnUserDto, isArray: true, description: "list of all users" })
    @Get()
    async getUsers(): Promise<ReturnUserDto[]> {
        const usersList = await this.usersService.getAll();
        return plainToClass(ReturnUserDto, usersList);
    }

    @ApiOkResponse({ type: ReturnUserDto, isArray: false, description: "a specific user" })
    @Get('/:id')
    async getUserById(@Param('id') id: number): Promise<ReturnUserDto> {
        const user = await this.usersService.getOneById(id);
        return plainToClass(ReturnUserDto, user);
    }

    @ApiCreatedResponse({ type: ReturnUserDto })
    @Post('/register')
    async createUser(@Body(SETTINGS.VALIDATION_PIPE) body: CreateUserDto): Promise<ReturnUserDto> {
        const user = await this.usersService.createUser(body);
        return plainToClass(ReturnUserDto, user);
    }

    @ApiOkResponse({ type: ReturnUserDto })
    @Put('/:id')
    async updateUser(@Param('id') id: number, @Body(SETTINGS.VALIDATION_PIPE) body: UpdateUserDto): Promise<ReturnUserDto> {
        const user = await this.usersService.updateUser(id, body);
        return plainToClass(ReturnUserDto, user);
    }

    @ApiOkResponse({ type: ReturnUserDto })
    @Delete('/:id')
    async deleteUser(@Param('id') id: number): Promise<ReturnUserDto> {
        const user = await this.usersService.deleteUser(id);
        return plainToClass(ReturnUserDto, user);
    }

    @ApiOkResponse({ type: Token })
    @Post('/login')
    @HttpCode(200)
    async login(@Body() loginUserDto: LoginUserDto): Promise<Token> {
        const jwt = await this.usersService.login(loginUserDto);
        const token: Token = {
            access_token: jwt,
            token_type: 'JWT',
            expires_in: 10000
        }
        return token;
    }
}
