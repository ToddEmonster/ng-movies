export interface UserInterface {
    username: string,
    password: string,
    token?: string, // "?" veut dire "optionnel"
    isAuthenticated: boolean,
    isAdmin? : boolean,
    firstName: string,
    lastName: string,
    email: string
}