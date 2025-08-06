export type UserCardResponseDTO = {
    userToken: string;
    connectionId: number;
    cardId: number;
    response: 'yes' | 'no' | null;
};
