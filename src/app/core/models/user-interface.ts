export interface UserInterface {
    login: string,
    password: string,
    token?: string, // "?" veut dire "optionnel"
    isAuthenticated: boolean
}
