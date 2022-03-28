import { LoxCallable } from "./loxCallable";
import { Interpreter } from "./interpreter";
import { LoxInstance } from "./loxInstance";
import { LoxFunction } from "./loxFunction";

export class LoxClass implements LoxCallable {
    name: string
    methods: Map<string, LoxFunction>
    superclass: LoxClass

    constructor(name: string, superclass: LoxClass, methods: Map<string, LoxFunction>) {
        this.name = name
        this.superclass = superclass
        this.methods = methods
    }

    public call(interpreter: Interpreter, args: Object[]): Object {
        let instance: LoxInstance = new LoxInstance(this)

        let initializer: LoxFunction = this.findMethod("init");
        if (initializer != null) {
          initializer.bind(instance).call(interpreter, args);
        }

        return instance
    }
    public toString(): string {
        return this.name
    }
    public arity(): number {
        let initializer: LoxFunction = this.findMethod("init");
        if (initializer === null) return 0
        return initializer.arity()
    }

    public findMethod(name: string): LoxFunction {
        if (this.methods.has(name)) {
            return this.methods.get(name) as LoxFunction
        }
        if (this.superclass !== null) {
            return this.superclass.findMethod(name)
        }
        return null as any
    }
}