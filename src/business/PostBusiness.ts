import { PostDatabase } from "../database/PostDatabase"
import { PostDTO } from "../dtos/PostDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { PostDB } from "../interfaces/types"
import { Post } from "../models/Post"

export class PostBusiness {
    constructor(private postDatabase: PostDatabase, private postDTO: PostDTO) { }

    public getPosts = async (input: any) => {
        const { q } = input

        const postsDB = await this.postDatabase.findPosts(q)

        const posts: Post[] = postsDB.map((postDB) => new Post(
            postDB.id,
            postDB.creator_id,
            postDB.content,
            postDB.likes,
            postDB.dislikes
        ))

        return posts
    }

    public createPost = async (input: any) => {
        const { id, creatorId, content, likes, dislikes } = input

        if (creatorId.length !== 4) {
            throw new BadRequestError("'creatorId' deve possuir 4 caracteres")
        }

        if (content.length < 10) {
            throw new BadRequestError("'content' deve possuir pelo menos 10 caracteres")
        }

        if (likes.length >= 0) {
            throw new BadRequestError("'likes' deve ser maior ou igual à zero")
        }

        if (dislikes.length >= 0) {
            throw new BadRequestError("'dislikes' deve ser maior ou igual à zero")
        }

        const postDBExists = await this.postDatabase.findPostById(id)

        if (postDBExists) {
            throw new BadRequestError("'id' já existe")
        }

        const newPost = new Post(
            id,
            creatorId,
            content,
            likes,
            dislikes
        )

        const newPostDB: PostDB = {
            id: newPost.getId(),
            creator_id: newPost.getCreatorId(),
            content: newPost.getContent(),
            likes: newPost.getLikes(),
            dislikes: newPost.getDislikes()
        }

        await this.postDatabase.insertPost(newPostDB)

        const output = this.postDTO.createPostOutputDTO(newPost)

        return output
    }

    public editPost = async (input: any) => {
        const {
            idToEdit,
            newId,
            newCreatorId,
            newContent,
            newLikes,
            newDislikes
        } = input

        if (newId.length !== 4) {
            throw new BadRequestError("'id' deve possuir 4 caracteres")
        }

        if (newCreatorId.length !== 4) {
            throw new BadRequestError("'creatorId' deve possuir 4 caracteres")
        }

        if (newContent.length < 10) {
            throw new BadRequestError("'content' deve possuir mais de 10 caracteres")
        }

        if (newLikes.length >= 0) {
            throw new BadRequestError("'likes' deve ser maior ou igual à zero")
        }

        if (newDislikes.length >= 0) {
            throw new BadRequestError("'dislikes' deve ser maior ou igual à zero")
        }

        const postToEditDB = await this.postDatabase.findPostById(idToEdit)

        if (!postToEditDB) {
            throw new NotFoundError("'id' para editar não existe")
        }

        const post = new Post(
            postToEditDB.id,
            postToEditDB.creator_id,
            postToEditDB.content,
            postToEditDB.likes,
            postToEditDB.dislikes
        )

        newId && post.setId(newId)
        newCreatorId && post.setCreatorId(newCreatorId)
        newContent && post.setContent(newContent)
        newLikes && post.setLikes(newLikes)
        newDislikes && post.setDislikes(newDislikes)

        const updatedPostDB: PostDB = {
            id: post.getId(),
            creator_id: post.getCreatorId(),
            content: post.getContent(),
            likes: post.getLikes(),
            dislikes: post.getDislikes()
        }

        await this.postDatabase.updatePost(updatedPostDB)

        const output = this.postDTO.editPostOutputDTO(post)

        return output
    }

    public deletePost = async (input: any) => {
        const { idToDelete } = input

        const postToDeleteDB = await this.postDatabase.findPostById(idToDelete)

        if (!postToDeleteDB) {
            throw new NotFoundError("'id' para deletar não existe")
        }

        await this.postDatabase.deletePostById(postToDeleteDB.id)

        const output = {
            message: "'Post' deletado com sucesso"
        }

        return output
    }
}