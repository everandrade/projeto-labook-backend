export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string
}

export interface UserInputDTO {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string
}

export interface UserOutputDTO {
    message: string,
    User: {
        id: string,
        name: string,
        email: string,
        password: string,
        role: string
    }
}

export interface EditUserInputDTO {
    idToEdit: string,
    newId: string | undefined,
    newName: string | undefined,
    newEmail: string | undefined,
    newPassword: string | undefined,
    newRole: string | undefined
}

export interface EditUserOutputDTO {
    message: string,
    User: {
        id: string,
        name: string,
        email: string,
        password: string,
        role: string
    }
}
