import { ApiProperty } from "@nestjs/swagger";
import { Category, Mission, User } from "src/entities";
import { CreateMissionDto } from "./create-mission.dto";

export class CreateChallengeDto<T extends string | Category> {
    @ApiProperty({
        type: `string`,
        required: false,
        example: `취미`,
        description: `카테고리 이름`,
    })
    category?: T;

    @ApiProperty({
        type: `string`,
        required: true,
        example: `공부 챌린지`,
        description: `챌린지 이름`,
    })
    title: string;

    @ApiProperty({
        type: `string`,
        required: false,
        example: `공부하기 싫을 때! 30일만 해보자`,
        description: `챌린지 설명`, 
    })
    description?: string;

    @ApiProperty({
        type: `boolean`,
        required: true,
        example: false,
        description: `공개 여부, false 권장`
    })
    is_public: boolean;

    author?: User;

    // @ApiProperty({
    //     type: `string`,
    //     required: false,
    //     description: `대표 이미지`
    // })
    thumbnail?: string;
}

export class CreateOwnChallengeDto {
    @ApiProperty({
        type: CreateChallengeDto,
        required: true,
    })
    challenge: CreateChallengeDto<string>;

    @ApiProperty({
        type: Mission,
        isArray: true,
        required: true,
    })
    missions: CreateMissionDto[];
}
