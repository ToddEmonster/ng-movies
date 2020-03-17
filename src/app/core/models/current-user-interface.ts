export interface CurrentUserInterface {
    isAuthenticated: boolean,

    idUser: number,
    username: string,
    isAdmin: boolean,

    token?: string
}
