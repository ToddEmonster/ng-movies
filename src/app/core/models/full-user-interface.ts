export interface FullUserInterface {
    token?: string, // "?" veut dire "optionnel"

    username: string,
    password: string,
    
    idUser: number,
    firstName: string,
    lastName: string,
    email: string,
    
    isAuthenticated: boolean,
    isAdmin : boolean
}