import { PostDatabase } from "../database/PostDatabase"
import { CreatePostInputDTO, CreatePostOutputDTO, DeletePostInputDTO, DeletePostOutputDTO, EditPostInputDTO, EditPostOutputDTO, GetPostInputDTO, GetPostOutputDTO, LikeOrDislikePostInputDTO } from "../dtos/UserDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { ForbiddenRequestError } from "../errors/ForbiddenRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { LikeDislikeDB, PostWithCreatorDB, POST_LIKE, USER_ROLES } from "../interfaces/types"
import { Post } from "../models/Post"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
    ) { }

    public getPosts = async (input: GetPostInputDTO): Promise<GetPostOutputDTO> => {
        const { token } = input

        if (token === undefined) {
            throw new BadRequestError('Missing token')
        }

        if (!token) {
            throw new BadRequestError(`Invalid token`)
        }

        const tokenPayload = this.tokenManager.getPayload(token as string)

        if (tokenPayload === null) {
            throw new BadRequestError(`Invalid token payload`)
        }

        if (tokenPayload.role !== USER_ROLES.ADMIN) {
            throw new ForbiddenRequestError(`User ${tokenPayload.role} is not an administrator`)
        }

        const postWithCreatorsDB: PostWithCreatorDB[] =
            await this.postDatabase.getPostWithCreators()

        const posts = postWithCreatorsDB.map(
            (postWithCreatorDB) => {
                const post = new Post(
                    postWithCreatorDB.id,
                    postWithCreatorDB.creator_id,
                    postWithCreatorDB.content,
                    postWithCreatorDB.likes,
                    postWithCreatorDB.dislikes,
                    postWithCreatorDB.created_at,
                    postWithCreatorDB.updated_at,
                    postWithCreatorDB.creator_name
                )

                return post.toBusinessModel()
            }
        )

        const output: GetPostOutputDTO = posts

        return output
    }

    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
        const { token, name, content } = input

        if (token === undefined) {
            throw new BadRequestError('Missing token')
        }

        if (!token) {
            throw new BadRequestError(`Invalid token`)
        }

        const tokenPayload = this.tokenManager.getPayload(token as string)

        if (tokenPayload === null) {
            throw new BadRequestError(`Invalid token payload`)
        }

        if (tokenPayload.role !== USER_ROLES.ADMIN) {
            throw new ForbiddenRequestError(`User ${tokenPayload.role} is not an administrator`)
        }

        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorId = tokenPayload.id
        const creatorName = tokenPayload.name

        const post = new Post(
            id,
            creatorId,
            content,
            0,
            0,
            createdAt,
            updatedAt,
            creatorName
        )

        const postDB = post.toDBModel()

        await this.postDatabase.insertPost(postDB)

        const output: CreatePostOutputDTO = {
            message: "Post created successfully",
            content
        }

        return output
    }

    public editPost = async (input: EditPostInputDTO): Promise<EditPostOutputDTO> => {
        const { idToEdit, token, name } = input

        if (token === undefined) {
            throw new BadRequestError('Missing token')
        }

        if (!token) {
            throw new BadRequestError(`Invalid token`)
        }

        const tokenPayload = this.tokenManager.getPayload(token as string)

        if (tokenPayload === null) {
            throw new BadRequestError(`Invalid token payload`)
        }

        if (tokenPayload.role !== USER_ROLES.ADMIN) {
            throw new ForbiddenRequestError(`User ${tokenPayload.role} is not an administrator`)
        }

        if (typeof name !== "string") {
            throw new BadRequestError("'name' must be string")
        }

        const postToEditDB = await this.postDatabase.findPostById(idToEdit)

        if (!postToEditDB) {
            throw new NotFoundError("'id' to edit does not exist")
        }

        const creatorId = tokenPayload.id

        if (postToEditDB.creator_id !== creatorId) {
            throw new BadRequestError("only the person who created the post can edit it")
        }

        const creatorName = tokenPayload.name

        const post = new Post(
            postToEditDB.id,
            creatorId,
            postToEditDB.content,
            postToEditDB.likes,
            postToEditDB.dislikes,
            postToEditDB.created_at,
            postToEditDB.updated_at,
            creatorName
        )

        post.setUpdatedAt(new Date().toISOString())

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.updatePost(idToEdit, updatedPostDB)

        const output: EditPostOutputDTO = {
            message: "Post edited successfully"
        }
        
        return output
    }

    public deletePost = async (input: DeletePostInputDTO): Promise<DeletePostOutputDTO> => {
        const { idToDelete, token } = input

        if (token === undefined) {
            throw new BadRequestError('Missing token')
        }

        if (!token) {
            throw new BadRequestError(`Invalid token`)
        }

        const tokenPayload = this.tokenManager.getPayload(token as string)

        if (tokenPayload === null) {
            throw new BadRequestError(`Invalid token payload`)
        }

        if (tokenPayload.role !== USER_ROLES.ADMIN) {
            throw new ForbiddenRequestError(`User ${tokenPayload.role} is not an administrator`)
        }

        if (typeof idToDelete !== "string") {
            throw new BadRequestError("'idToDelete' must be string")
        }

        const postDB = await this.postDatabase.findPostById(idToDelete)

        if (!postDB) {
            throw new NotFoundError("'id' not found")
        }

        const creatorId = tokenPayload.id

        if (
            tokenPayload.role !== USER_ROLES.ADMIN
            && postDB.creator_id !== creatorId
        ) {
            throw new BadRequestError("only the person who created the post can delete it")
        }

        await this.postDatabase.deletePostById(idToDelete)

        const output: DeletePostOutputDTO = {
            message: "Post deleted successfully"
        }
        
        return output
    }

    public likeOrDislikePlaylist = async (input: LikeOrDislikePostInputDTO): Promise<void> => {
        const { idToLikeOrDislike, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("Missing token")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("invalid token")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' must be boolean")
        }

        const postWithCreatorDB = await this.postDatabase
            .findPostWithCreatorById(idToLikeOrDislike)

        if (!postWithCreatorDB) {
            throw new NotFoundError("'id' not found")
        }

        const userId = tokenPayload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeDB = {
            user_id: userId,
            post_id: postWithCreatorDB.id,
            like: likeSQLite
        }

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_name,
        )

        const likeDislikeExists = await this.postDatabase
            .findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
            }

        } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
            }

        } else {
            await this.postDatabase.likeOrDislikePlaylist(likeDislikeDB)

            like ? post.addLike() : post.addDislike()
        }

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.updatePost(idToLikeOrDislike, updatedPostDB)
    }
}