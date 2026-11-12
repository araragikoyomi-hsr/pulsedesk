import { PartialType } from "@nestjs/swagger";
import { CreateIncidentDto } from "./create-incident.dto.js";
import { IsEnum, IsOptional } from "class-validator";
import { IncidentStatus } from "../enums/incident-status.enum.js";

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {
    @IsEnum(IncidentStatus)
    @IsOptional()
    status?: IncidentStatus
}