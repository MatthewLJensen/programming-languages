import { LoxCallable } from "./loxCallable";
import { Environment } from "./environment";
import { Interpreter } from "./interpreter";
import { Func } from "./stmt";

export class LoxFunction implements LoxCallable {
    private declaration: Func
    constructor(declaration: Func) {
        this.declaration = declaration;
    }
    public call(interpreter: Interpreter, args: Object[]): Object {
        let environment: Environment = new Environment(interpreter.globals);

        for (let i = 0; i < this.declaration.params.length; i++) {
            environment.define(this.declaration.params[i].lexeme,
                args[i]);
        }

        interpreter.executeBlock(this.declaration.body, environment);
        return null as any;
    }
    public arity(): number {
        return this.declaration.params.length;
    }
    public toString(): string {
        return "<fn " + this.declaration.name.lexeme + ">";
    }
}