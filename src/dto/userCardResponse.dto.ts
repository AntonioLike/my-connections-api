export type UserCardResponseDTO = {
    userToken: string;
    linkId: number;
    cardId: number;
    response: 'yes' | 'no' | null;
};
