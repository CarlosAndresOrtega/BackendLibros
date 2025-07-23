import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 👈 aquí importamos la entidad
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 👈 exportamos el servicio para usarlo en AuthModule
})
export class UsersModule {}
