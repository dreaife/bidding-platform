import { IsNotEmpty, IsNumber, Min, IsString, IsDate, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectsDto {
  @ApiProperty({ description: '项目标题' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '项目描述' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: '最低预算' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  budget_min: number;

  @ApiProperty({ description: '最高预算' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  budget_max: number;

  @ApiProperty({ description: '截止日期' })
  @IsNotEmpty()
  deadline: Date;
}

export class UpdateProjectDto {
  @ApiProperty({ description: '项目状态' })
  @IsString()
  @IsIn(['open', 'in_progress', 'completed'])
  status: string;
}
