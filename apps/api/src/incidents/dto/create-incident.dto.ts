import { ApiProperty } from "@nestjs/swagger";
import { IncidentSeverity } from "../enums/incident-severity.enum.js";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateIncidentDto {

    @ApiProperty({ example: 'Payment service timeout' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ enum: IncidentSeverity, example: IncidentSeverity.HIGH })
    @IsEnum(IncidentSeverity)
    severity: IncidentSeverity;

    @ApiProperty({ required: false, example: 'Payment API is responding slowly' })
    @IsString()
    @IsOptional()
    description?: string;
}