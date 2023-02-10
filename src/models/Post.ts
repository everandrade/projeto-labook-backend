export class Post {
    constructor(
        private id: string,
        private creatorId: string,
        private content: string,
        private likes: number,
        private dislikes: number
    ) { }

    public getId(): string {
        return this.id;
    }
    public setId(value: string) {
        this.id = value;
    }
    public getCreatorId(): string {
        return this.creatorId;
    }
    public setCreatorId(value: string) {
        this.creatorId = value;
    }
    public getContent(): string {
        return this.content;
    }
    public setContent(value: string) {
        this.content = value;
    }
    public getLikes(): number {
        return this.likes;
    }
    public setLikes(value: number) {
        this.likes = value;
    }
    public getDislikes(): number {
        return this.dislikes;
    }
    public setDislikes(value: number) {
        this.dislikes = value;
    }
}