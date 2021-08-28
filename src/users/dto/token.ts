import { ApiProperty } from "@nestjs/swagger";

export class Token {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    token_type: string;

    @ApiProperty()
    expires_in: number;
};