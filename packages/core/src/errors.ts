export class BlogError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BlogError';
    }
}