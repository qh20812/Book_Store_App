import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserRole } from './entities/user.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) { }
  findByEmail(email: string) {
    return this.model.findOne({ email }).lean().exec();
  }

  create(email: string, full_name: string, passwordHash: string, roles: string[] = [UserRole.USER]): Promise<User> {
    return this.model.create({ email, full_name, password: passwordHash, role: roles[0] });
  }

  async findAll(){
    return this.model.find({}, {_id: 1, email: 1, full_name: 1, role: 1, createdAt: 1, updatedAt: 1}).lean().exec();
  }
}
