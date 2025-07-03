export type UserCardResponseDTO = {
    userId: number;
    linkId: number;
    cardId: number;
    response: 'yes' | 'no' | null;
};
