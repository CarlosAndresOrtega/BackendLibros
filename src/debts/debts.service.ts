import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Debt } from './entities/debt.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DebtsService {
  constructor(
    @InjectRepository(Debt)
    private readonly debtRepository: Repository<Debt>,
  ) {}

  create(createDebtDto: CreateDebtDto) {
    return 'This action adds a new debt';
  }

  findAll() {
    return `This action returns all debts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} debt`;
  }

  async update(id: number, updateDebtDto: UpdateDebtDto) {
    const debt = await this.debtRepository.findOneBy({ id });

    if (!debt) throw new NotFoundException('Deuda no encontrada');

    if (debt.isPaid) {
      throw new BadRequestException('Una deuda pagada no puede ser modificada');
    }

    return await this.debtRepository.save({ ...debt, ...updateDebtDto });
  }

  remove(id: number) {
    return `This action removes a #${id} debt`;
  }
}
