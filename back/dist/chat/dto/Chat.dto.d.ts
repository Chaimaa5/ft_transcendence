export declare class CreateRoom {
    name: String;
    image?: String;
    memberId: String;
}
export declare class AddMember {
    roomId: number;
    userId: String;
}
export declare class CreateChannel {
    name: String;
    image?: String;
    type?: String;
    password?: String;
}
export declare class UpdateChannel {
    roomId?: number;
    name?: String;
    image?: String;
    type?: String;
    password?: String;
}
