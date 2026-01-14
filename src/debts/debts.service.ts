import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debt } from './entities/debt.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';

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
    const stats = await this.debtRepository
      .createQueryBuilder('debt')
      .select('SUM(CASE WHEN debt.isPaid = false THEN CAST(debt.amount AS DECIMAL) ELSE 0 END)', 'pendingBalance')
      .addSelect('SUM(CASE WHEN debt.isPaid = true THEN CAST(debt.amount AS DECIMAL) ELSE 0 END)', 'totalPaid')
      .where('debt.userId = :userId', { userId })
      .getRawOne();
  
    return {
      pendingBalance: parseFloat(stats.pendingBalance || 0),
      totalPaid: parseFloat(stats.totalPaid || 0),
    };
  }

  async update(id: number, updateDebtDto: UpdateDebtDto) {
    const debt = await this.debtRepository.findOneBy({ id });
    
    if (!debt) throw new NotFoundException('Deuda no encontrada');
  
    // REGLA OBLIGATORIA: Una deuda pagada no puede ser modificada
    if (debt.isPaid) {
      throw new BadRequestException('No puedes modificar una deuda que ya ha sido pagada');
    }
  
    Object.assign(debt, updateDebtDto);
    return await this.debtRepository.save(debt);
  }
}
