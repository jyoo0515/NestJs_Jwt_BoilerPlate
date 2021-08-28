import { ApiProperty } from "@nestjs/swagger";

export class ReturnUserDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;
}