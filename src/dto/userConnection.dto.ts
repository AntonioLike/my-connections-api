export type connectionUserDTO = {
    userToken: string;
    name: string;
}

export type userConnectionDTO = {
    id: number;
    user: connectionUserDTO;
}
