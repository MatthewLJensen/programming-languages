import { LoxClass } from './loxClass';
import { LoxFunction } from './loxFunction';
import { RuntimeError } from './runtimeError';
import { Token } from './token';

export class LoxInstance {
    private klass: LoxClass
    private fields: Map<String, Object> = new Map<String, Object>();

    constructor(klass: LoxClass) {
        this.klass = klass;
    }

    public get(name: Token): Object {
        if (this.fields.has(name.lexeme)) {
            return this.fields.get(name.lexeme) as Object
        }

        let method: LoxFunction = this.klass.findMethod(name.lexeme)
        if (method) return method

        throw new RuntimeError(name, "Undefined property '" + name.lexeme + "'.")
    }
    
    public set(name: Token, value: Object): void {
        this.fields.set(name.lexeme, value);
    }
    public toString(): string {
        return this.klass.name + " instance";
    }
}