import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  getAll(): Promise<User[]> {
    return this.usersRepository.find();
    // SELECT * from user
  }

  async getOneById(id: number): Promise<User | null> {
    try {
      // const user = await this.usersRepository.findOneOrFail({ id }, { select: ['id', 'email', 'name'] });
      const user = await this.usersRepository.findOneOrFail({ id });
      return user;
    } catch (err) {
      return null;
    }
  }

  async getOneByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOneOrFail({ username });
      return user;
    } catch (err) {
      return null;
    }
  }

  async getOneByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOneOrFail({ email });
      return user;
    } catch (err) {
      return null;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.getOneByEmail(createUserDto.email);
    if (user) {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    } else {
      const newUser = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(newUser);
    }
  }
  // Todo: make sure that user does not use the same password as before
  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.getOneById(userId);
    if (user) {
      return await this.usersRepository.save(
        Object.assign(user, updateUserDto),
      );
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.getOneById(id);
    return await this.usersRepository.remove(user);
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.getOneByUsername(loginUserDto.username);
    if (user) {
      const valid = await this.authService.comparePassword(
        loginUserDto.password,
        user.password,
      );
      if (valid) {
        const userId = await this.getOneById(user.id);
        return this.authService.generateJwt(userId);
      } else {
        throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
