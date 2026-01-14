import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debt } from './entities/debt.entity';
import { CreateDebtDto } from './dto/create-debt.dto';

@Injectable()
export class DebtsService {
  constructor(
    @InjectRepository(Debt)
    private readonly debtRepository: Repository<Debt>,
  ) {}

  async create(createDebtDto: CreateDebtDto, userId: number) {
    const newDebt = this.debtRepository.create({
      ...createDebtDto,
      user: { id: userId } as any, 
    });
    return await this.debtRepository.save(newDebt);
  }

  async findAll(userId: number) {
    return await this.debtRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsPaid(id: number) {
    const debt = await this.debtRepository.findOneBy({ id });
    if (!debt) throw new NotFoundException('Deuda no encontrada');

    return await this.debtRepository.save({ ...debt, isPaid: true });
  }

  async getStats(userId: number) {
    const queryBuilder = this.debtRepository.createQueryBuilder('debt');

    const stats = await queryBuilder
      .select(
        'SUM(CASE WHEN debt.isPaid = true THEN debt.amount ELSE 0 END)',
        'totalPaid',
      )
      .addSelect(
        'SUM(CASE WHEN debt.isPaid = false THEN debt.amount ELSE 0 END)',
        'pendingBalance',
      )
      .where('debt.userId = :userId', { userId })
      .getRawOne();

    return stats;
  }
}
