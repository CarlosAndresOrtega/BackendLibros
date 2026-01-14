import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('debts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(CacheInterceptor)
@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  create(@Body() createDebtDto: CreateDebtDto, @Request() req) {
    // req.user viene del JWT una vez validado
    return this.debtsService.create(createDebtDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.debtsService.findAll(req.user.id);
  }

  @Get('stats') // Puntos extra: Agregaciones
  getStats(@Request() req) {
    return this.debtsService.getStats(req.user.id);
  }

  @Patch(':id/pay') // Marcar como pagada (Requisito)
  markAsPaid(@Param('id') id: string) {
    return this.debtsService.markAsPaid(+id);
  }
}