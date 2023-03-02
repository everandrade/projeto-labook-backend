import { PostModel, UserModel, USER_ROLES } from "../interfaces/types"

export interface GetUsersInput {
    q: unknown,
    token: unknown
}

export type GetUsersOutput = UserModel[]

export interface SignupInput {
    name: unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutput {
    message: string,
    token: string
}

export interface LoginInput {
    email: unknown,
    password: unknown
}

export interface LoginOutput {
    message: string,
    token: string
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
    token: string | undefined,
    name: unknown
}

export interface EditPostOutputDTO {
    message: string
}

export interface UserInputDTO {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES
}

export interface UserOutputDTO {
    message: string,
    User: {
        id: string,
        name: string,
        email: string,
        password: string,
        role: USER_ROLES
    }
}

export interface EditUserInputDTO {
    idToEdit: string,
    newId: string | undefined,
    newName: string | undefined,
    newEmail: string | undefined,
    newPassword: string | undefined,
    newRole: USER_ROLES | undefined
}

export interface EditUserOutputDTO {
    message: string,
    User: {
        id: string,
        name: string,
        email: string,
        password: string,
        role: USER_ROLES
    }
}

export interface GetPostInputDTO {
    token: string | undefined
}

export type GetPostOutputDTO = PostModel[]

export interface CreatePostInputDTO {
    token: string | undefined,
    name: unknown,
    content: string
}

export interface CreatePostOutputDTO {
    message: string,
    content: string
}

export interface EditPostInputDTO {
    idToEdit: string,
    token: string | undefined,
    name: unknown
}

export interface DeletePostInputDTO {
    idToDelete: string,
    token: string | undefined
}

export interface DeletePostOutputDTO {
    message: string
}

export interface LikeOrDislikePostInputDTO {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}