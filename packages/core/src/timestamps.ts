import { BlogError } from "./errors";
import { WithTimeStamps } from "./types";

/**
 * Class to add timestamps to a model
 * 
 * When calling the update method, the updatedAt field will be updated
 * 
 * Note: the update method is called before the derived class update method
 * so if you change the updatedAt field in the derived class, it will be
 * overwritten
 * 
 * @example
 * class User extends TimeStamps {
 *  name: string;
 *  constructor({name, ...rest} = {}) {
 *      super(rest);
 *      this.name = name;
 *  }
 * 
 *  update({name}) {
 *      this.name = name;
 *  }
 * }
 * 
 * var user = new User({name: "John"});
 * user.update({name: "Jane"});
 * console.log(user.updatedAt); // Will be the time when the update method was called
 */
export class TimeStamps implements WithTimeStamps {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

    constructor({createdAt = new Date(), updatedAt = new Date()} = {}) {
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        ["update", "delete", "restore"].forEach((method) => {
            const original = this[method];
            this[method] = (...args: any[]) => {
                TimeStamps.prototype[method].apply(this, args);
                return original.apply(this, args);
            }
        });
    }

    update(...args: any[]) {
        this.verifyNotDeleted();
        this.updatedAt = new Date();
    }

    delete() {
        this.verifyNotDeleted();
        this.deletedAt = new Date();
    }

    restore() {
        this.deletedAt = null;
    }

    /**
     * Verify that the object has not been deleted, and throw an error if it has.
     * 
     * @param errorMessage The error message to throw if the object has been deleted. If false, no error will be thrown.
     * @returns True if the object has not been deleted, false if it has.
     * @throws BlogError if the object has been deleted.
     */
    protected verifyNotDeleted(errorMessage: string | false = "This object has been deleted") {
        if (this.deletedAt) {
            if (errorMessage) {
                throw new BlogError(errorMessage || "This object has been deleted");
            }
            return false;
        }
        return true;
    }
}