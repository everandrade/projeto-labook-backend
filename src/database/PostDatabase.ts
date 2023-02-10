import { PostDB } from "../interfaces/types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"

    public async findPosts(q: string | undefined) {
        if (q) {
            const result: PostDB[] = await BaseDatabase
                .connection(PostDatabase.TABLE_POSTS)
                .where("name", "LIKE", `%${q}%`)

            return result

        } else {
            const result: PostDB[] = await BaseDatabase
                .connection(PostDatabase.TABLE_POSTS)

            return result
        }
    }

    public async findPostById(id: string) {
        const [postDB]: PostDB[] | undefined[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where({ id })

        return postDB
    }

    public async insertPost(newPostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }

    public async updatePost(PostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(PostDB)
            .where({ id: PostDB.id })
    }

    public async deletePostById(id: string) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .delete()
            .where({ id })
    }
}
