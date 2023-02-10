import { BadRequestError } from "../errors/BadRequestError"
import { EditPostInputDTO, EditPostOutputDTO, PostInputDTO, PostOutputDTO } from "../interfaces/types"
import { Post } from "../models/Post"

export class PostDTO {
    public createPostInputDTO(
        id: unknown,
        creatorId: unknown,
        content: unknown,
        likes: unknown,
        dislikes: unknown): PostInputDTO {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }

        if (typeof creatorId !== "string") {
            throw new BadRequestError("'creatorId' deve ser string")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        if (typeof likes !== "number") {
            throw new BadRequestError("'likes' deve ser number")
        }

        if (typeof dislikes !== "number") {
            throw new BadRequestError("'dislikes' deve ser number")
        }

        const dto: PostInputDTO = {
            id,
            creatorId,
            content,
            likes,
            dislikes
        }
        return dto
    }

    public createPostOutputDTO(parameter: Post): PostOutputDTO {
        const dto: PostOutputDTO = {
            message: "Post registrado com sucesso",
            Post: {
                id: parameter.getId(),
                creatorId: parameter.getCreatorId(),
                content: parameter.getContent(),
                likes: parameter.getLikes(),
                dislikes: parameter.getDislikes()
            }
        }
        return dto
    }

    public editPostInputDTO(idToEdit: string, newId: unknown, newCreatorId: unknown, newContent: unknown, newLikes: unknown, newDislikes: unknown): EditPostInputDTO {
        if (newId !== undefined) {
            if (typeof newId !== "string") {
                throw new BadRequestError("'id' deve ser string")
            }
        }

        if (newCreatorId !== undefined) {
            if (typeof newCreatorId !== "string") {
                throw new BadRequestError("'creatorId' deve ser string")
            }
        }

        if (newContent !== undefined) {
            if (typeof newContent !== "string") {
                throw new BadRequestError("'content' deve ser string")
            }
        }

        if (newLikes !== undefined) {
            if (typeof newLikes !== "number") {
                throw new BadRequestError("'likes' deve ser number")
            }
        }

        if (newDislikes !== undefined) {
            if (typeof newDislikes !== "number") {
                throw new BadRequestError("'dislikes' deve ser number")
            }
        }

        const dto: EditPostInputDTO = {
            idToEdit,
            newId,
            newCreatorId,
            newContent,
            newLikes,
            newDislikes
        }
        return dto
    }

    public editPostOutputDTO(parameter: Post): EditPostOutputDTO {
        const dto: EditPostOutputDTO = {
            message: "'Post' editado com sucesso",
            Post: {
                id: parameter.getId(),
                creatorId: parameter.getCreatorId(),
                content: parameter.getContent(),
                likes: parameter.getLikes(),
                dislikes: parameter.getDislikes()
            }
        }
        return dto
    }
}