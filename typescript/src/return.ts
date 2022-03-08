export class Return extends Error {
    value: Object
    constructor(value: Object, message?: string) {
        super(message);
        this.value = value;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
