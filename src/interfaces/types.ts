//------------------Users
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

//------------------Posts

export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number
}

export interface PostInputDTO {
    id: string,
    creatorId: string,
    content: string,
    likes: number,
    dislikes: number
}

export interface PostOutputDTO {
    message: string,
    Post: {
        id: string,
        creatorId: string,
        content: string,
        likes: number,
        dislikes: number
    }
}

export interface EditPostInputDTO {
    idToEdit: string,
    newId: string | undefined,
    newCreatorId: string | undefined,
    newContent: string | undefined,
    newLikes: number | undefined,
    newDislikes: number | undefined
}

export interface EditPostOutputDTO {
    message: string,
    Post: {
        id: string,
        creatorId: string,
        content: string,
        likes: number,
        dislikes: number
    }
}