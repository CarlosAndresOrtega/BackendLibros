import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DebtsModule } from './debts/debts.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'debtdb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CacheModule.register(),
    BooksModule,
    AuthModule,
    UsersModule,
    DebtsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
