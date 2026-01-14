import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateDebtDto {
  @ApiProperty({ example: 'Almuerzo viernes', description: 'Concepto de la deuda' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description: string;

  @ApiProperty({ example: 15500.50, description: 'Monto total de la deuda' })
  @IsNumber()
  @IsPositive()
  amount: number;
}