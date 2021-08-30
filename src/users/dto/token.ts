import { ApiProperty } from "@nestjs/swagger";

export class Token {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    expires_in: string;
};