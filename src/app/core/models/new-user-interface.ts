export interface NewUserInterface {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    token?: string, // "?" veut dire "optionnel"
    alreadyExists: boolean

}
