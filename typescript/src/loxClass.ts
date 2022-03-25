import { LoxCallable } from "./loxCallable";
import { Interpreter } from "./interpreter";
import { LoxInstance } from "./loxInstance";
import { LoxFunction } from "./loxFunction";

export class LoxClass implements LoxCallable {
    name: string
    methods: Map<string, LoxFunction>

    constructor(name: string, methods: Map<string, LoxFunction>) {
        this.name = name
        this.methods = methods
    }

    public call(interpreter: Interpreter, args: Object[]): Object {
        let instance: LoxInstance = new LoxInstance(this)
        return instance
    }
    public toString(): string {
        return this.name
    }
    public arity(): number {
        return 0
    }

    public findMethod(name: string): LoxFunction {
        if (this.methods.has(name)) {
            return this.methods.get(name) as LoxFunction
        }
        return null as any
    }
}