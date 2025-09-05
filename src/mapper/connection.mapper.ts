import { userConnectionDTO } from '../dto/userConnection.dto';
import { Connection } from '../entity/connection';
import { User } from '../entity/user';

export function toUserConnectionDTO(
    connection: Connection, currentUser: User
): userConnectionDTO {
    const targetUser: User = connection.user1.userToken === currentUser.userToken ? connection.user2 : connection.user1;
    return {
        id: connection.id,
        user: { userToken: targetUser.userToken, name: targetUser.name }
    };
}

export function toUserConnectionDTOs(
    connections: Connection[], currentUser: User
): userConnectionDTO[] {
    return connections.map(conn => toUserConnectionDTO(conn, currentUser));
}