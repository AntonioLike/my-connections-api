export class ConflictError extends Error {
    status = 409;
    constructor(message: string) {
        super(message);
        this.name = "ConflictError";
    }
}