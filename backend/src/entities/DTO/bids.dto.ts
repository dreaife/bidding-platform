import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BidsDto {
    @ApiProperty({ description: '投标ID' })
    @IsNotEmpty()
    @IsNumber()
    bid_id: number;

    @ApiProperty({ description: '项目ID' })
    @IsNotEmpty()
    @IsNumber()
    project_id: number;

    @ApiProperty({ description: '投标人ID' })
    @IsNotEmpty()
    @IsNumber()
    bidder_id: number;

    @ApiProperty({ description: '投标金额' })
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({ description: '投标留言' })
    @IsNotEmpty()
    @IsString()
    message: string;

    @ApiProperty({ description: '投标状态' })
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty({ description: '创建时间' })
    @IsNotEmpty()
    created_at: Date;

    @ApiProperty({ description: '更新时间' })
    @IsNotEmpty()
    updated_at: Date;
  }
  