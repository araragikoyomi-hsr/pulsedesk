import { IncidentSeverity } from "../enums/incident-severity.enum.js";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateIncidentDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsEnum(IncidentSeverity)
    severity: IncidentSeverity;
    @IsString()
    @IsOptional()
    description?: string;
}