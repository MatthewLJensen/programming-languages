
import { RuntimeError } from "./runtimeError"
import { Token } from "./token"
export class Environment {
    enclosing: Environment
    private values: Map<string, Object> = new Map<string, Object>()

    constructor(enclosing: Environment = null as any) {
        this.enclosing = enclosing
    }

    get(name: Token): Object {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme) as any // I feel like this "as any" shouldn't be necessary
        }

        if (this.enclosing != null) return this.enclosing.get(name)

        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
    }
    assign(name: Token, value: Object) {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value);
            return;
        }

        if (this.enclosing != null) {
            this.enclosing.assign(name, value)
            return
        }

        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
    }
    define(name: string, value: Object) {
        this.values.set(name, value);
    }
}