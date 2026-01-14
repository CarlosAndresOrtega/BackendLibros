import { Module } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debt } from './entities/debt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Debt]), 
  ],
  controllers: [DebtsController],
  providers: [DebtsService],
  exports: [DebtsService],
})
export class DebtsModule {}
