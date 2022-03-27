import { LoxCallable } from "./loxCallable";
import { Environment } from "./environment";
import { Interpreter } from "./interpreter";
import { Func } from "./stmt";
import { Return } from "./return";
import { LoxInstance } from "./loxInstance";

export class LoxFunction implements LoxCallable {
    private declaration: Func
    private closure: Environment;
    private isInitializer: boolean

    constructor(declaration: Func, closure: Environment, isInitializer: boolean) {
        this.closure = closure;
        this.declaration = declaration;
        this.isInitializer = isInitializer;
    }
    public call(interpreter: Interpreter, args: Object[]): Object {
        let environment: Environment = new Environment(this.closure);

        for (let i = 0; i < this.declaration.params.length; i++) {
            environment.define(this.declaration.params[i].lexeme,
                args[i]);
        }

        try {
            interpreter.executeBlock(this.declaration.body, environment);
        } catch (error) {
            if (error instanceof Return) {
                if (this.isInitializer) return this.closure.getAt(0, "this");
                return error.value;
            } else {
                throw error;
            }
        }
        if (this.isInitializer) return this.closure.getAt(0, "this");
        return null as any;
    }

    public bind(instance: LoxInstance): LoxFunction {
        let environment: Environment = new Environment(this.closure);
        environment.define("this", instance);
        return new LoxFunction(this.declaration, environment, this.isInitializer);
    }

    public arity(): number {
        return this.declaration.params.length;
    }
    public toString(): string {
        return "<fn " + this.declaration.name.lexeme + ">";
    }
}