import { IsNotEmpty, IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateDebtDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description: string;

  @IsNumber()
  @IsPositive({ message: 'El monto de la deuda debe ser un valor positivo' }) 
  amount: number;
}