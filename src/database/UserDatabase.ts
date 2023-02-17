import { UserDB } from "../interfaces/types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async findUsers(q: string | undefined) {
        if (q) {
            const result: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                .where("name", "LIKE", `%${q}%`)

            return result

        } else {
            const result: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)

            return result
        }
    }

    public async findUserById(id: string): Promise<UserDB | undefined> {
        const [ userDB ]: UserDB[] | undefined[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ id })

        return userDB
    }

    public async insertUser(newUserDB: UserDB): Promise<void>  {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(newUserDB)
    }

    // public async updateUser(userDB: UserDB) {
    //     await BaseDatabase
    //         .connection(UserDatabase.TABLE_USERS)
    //         .update(userDB)
    //         .where({ id: userDB.id })
    // }

    // public async deleteUserById(id: string) {
    //     await BaseDatabase
    //         .connection(UserDatabase.TABLE_USERS)
    //         .delete()
    //         .where({ id })
    // }

    public async findUserByEmail(email: string): Promise<UserDB | undefined> {
        const [ userDB ]: UserDB[] | undefined[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ email })

        return userDB
    }
}
