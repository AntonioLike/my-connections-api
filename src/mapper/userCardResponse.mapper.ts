import { UserCardResponse } from '../entity/userCardResponse';
import { UserCardResponseDTO } from '../dto/userCardResponse.dto';

export function toUserCardResponseDTO(
    entity: UserCardResponse
): UserCardResponseDTO {
    return {
        userToken: entity.user.userToken,
        linkId: entity.link.id,
        cardId: entity.card.id,
        response: entity.response ?? null,
    };
}
