import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostInputDTO, LikeOrDislikePostInputDTO } from "../dtos/UserDTO"
import { BaseError } from "../errors/BaseError"

export class PostController {
    constructor(
        private postBusiness: PostBusiness,
    ) { }

    public getPosts = async (req: Request, res: Response) => {
        try {
            const input: GetPostInputDTO = {
                token: req.headers.authorization
            }

            const output = await this.postBusiness.getPosts(input)

            res.status(200).send(output)
        } catch (error) {
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Unexpected error")
            }
        }
    }

    public createPost = async (req: Request, res: Response) => {
        try {
            const input: CreatePostInputDTO = {
                token: req.headers.authorization,
                name: req.body.name
            }

            await this.postBusiness.createPost(input)

            res.status(201).end()
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Unexpected error")
            }
        }
    }

    public editPost = async (req: Request, res: Response) => {
        try {
            const input: EditPostInputDTO = {
                idToEdit: req.params.id,
                name: req.body.name,
                token: req.headers.authorization
            }

            await this.postBusiness.editPost(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Unexpected error")
            }
        }
    }

    public deletePost = async (req: Request, res: Response) => {
        try {
            const input: DeletePostInputDTO = {
                idToDelete: req.params.id,
                token: req.headers.authorization
            }

            await this.postBusiness.deletePost(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Unexpected error")
            }
        }
    }

    public likeOrDislikePlaylist = async (req: Request, res: Response) => {
        try {
            const input: LikeOrDislikePostInputDTO = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }

            await this.postBusiness.likeOrDislikePlaylist(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Unexpected error")
            }
        }
    }
}