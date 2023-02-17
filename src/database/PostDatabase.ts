import { LikeDislikeDB, PostDB, PostWithCreatorDB, POST_LIKE } from "../interfaces/types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    // public async findPosts(q: string | undefined) {
    //     if (q) {
    //         const result: PostDB[] = await BaseDatabase
    //             .connection(PostDatabase.TABLE_POSTS)
    //             .where("name", "LIKE", `%${q}%`)

    //         return result

    //     } else {
    //         const result: PostDB[] = await BaseDatabase
    //             .connection(PostDatabase.TABLE_POSTS)

    //         return result
    //     }
    // }

    public async findPostById(id: string): Promise<PostDB | undefined> {
        const [postDB]: PostDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select()
            .where({ id })

        return postDB
    }

    public async getPostWithCreators(): Promise<PostWithCreatorDB[]> {
        const result: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "post.id",
                "post.creator_id",
                "post.name",
                "post.likes",
                "post.dislikes",
                "post.created_at",
                "post.updated_at",
                "users.name AS creator_name"
            )
            .join("users", "post.creator_id", "=", "users.id")

        return result
    }

    public async insertPost(newPostDB: PostDB): Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }

    public async updatePost(id: string, PostDB: PostDB): Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(PostDB)
            .where({ id })
    }

    public async deletePostById(id: string): Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .delete()
            .where({ id })
    }

    public async findPostWithCreatorById(postId: string): Promise<PostWithCreatorDB | undefined> {
        const result: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "post.id",
                "post.creator_id",
                "post.name",
                "post.likes",
                "post.dislikes",
                "post.created_at",
                "post.updated_at",
                "users.name AS creator_name"
            )
            .join("users", "post.creator_id", "=", "users.id")
            .where("post.id", postId)

        return result[0]
    }

    public async likeOrDislikePlaylist(likeDislike: LikeDislikeDB): Promise<void> {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .insert(likeDislike)
    }

    public async findLikeDislike(likeDislikeDBToFind: LikeDislikeDB): Promise<POST_LIKE | null> {
        const [likeDislikeDB]: LikeDislikeDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .select()
            .where({
                user_id: likeDislikeDBToFind.user_id,
                post_id: likeDislikeDBToFind.post_id
            })

        if (likeDislikeDB) {
            return likeDislikeDB.like === 1
                ? POST_LIKE.ALREADY_LIKED
                : POST_LIKE.ALREADY_DISLIKED

        } else {
            return null
        }
    }

    public async removeLikeDislike(likeDislikeDB: LikeDislikeDB): Promise<void> {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likeDislikeDB.user_id,
                post_id: likeDislikeDB.post_id
            })
    }

    public async updateLikeDislike(likeDislikeDB: LikeDislikeDB) {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .update(likeDislikeDB)
            .where({
                user_id: likeDislikeDB.user_id,
                post_id: likeDislikeDB.post_id
            })
    }
}
