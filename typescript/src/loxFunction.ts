import { LoxCallable } from "./loxCallable";
import { Environment } from "./environment";
import { Interpreter } from "./interpreter";
import { Func } from "./stmt";
import { Return } from "./return";

export class LoxFunction implements LoxCallable {
    private declaration: Func
    private closure: Environment;

    constructor(declaration: Func, closure: Environment) {
        this.closure = closure;
        this.declaration = declaration;
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
                return error.value;
            } else {
                throw error;
            }
        }
        return null as any;
    }

    public arity(): number {
        return this.declaration.params.length;
    }
    public toString(): string {
        return "<fn " + this.declaration.name.lexeme + ">";
    }
}