import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(){
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto){
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.create(
      createUserDto.email, 
      createUserDto.full_name,
      passwordHash
    );
  }

  @Get(':email')
  findByEmail(@Param('email') email: string){
    return this.usersService.findByEmail(email);
  }
}
