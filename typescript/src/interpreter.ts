import * as Expr from "./expr"
import * as Stmt from "./stmt"
import { TokenType } from "./tokenType"
import { Token } from "./token"
import { RuntimeError } from "./runtimeError"
import { runtimeError } from "./errorHandling"
import { Environment } from "./environment"
import { LoxCallable, isLoxCallable } from "./loxCallable"
import { LoxFunction } from "./loxFunction"
import { LoxClass } from "./loxClass"
import { Return } from "./return"
import { LoxInstance } from "./loxInstance"


class ContinueException extends Error {
    constructor(message?: string) {
        super(message); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
class BreakException extends Error {
    constructor(message?: string) {
        super(message); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
export class Interpreter implements Expr.Visitor<Object>, Stmt.Visitor<Object>{
    readonly globals: Environment = new Environment();
    private environment: Environment = this.globals
    private locals: Map<Expr.Expr, number> = new Map<Expr.Expr, number>()

    constructor() {
        this.globals.define("clock", new class implements LoxCallable {
            arity(): number {
                return 0;
            }

            call(interpreter: Interpreter, args: Object[]): Object {
                return (Date.now() / 1000.0) as number;
            }

            toString(): string { return "<native fn>"; }
        });
    }


    interpret(statements: Stmt.Stmt[]) {
        try {
            for (let statement of statements) {
                this.execute(statement);
            }
        } catch (error) {
            if (error instanceof RuntimeError) {
                runtimeError(error as RuntimeError)
            } else {
                throw error
            }
        }
    }

    interpretExpression(expression: Expr.Expr) {
        try {
            const value: Object = this.evaluate(expression);
            console.log(stringify(value))
        } catch (error) {
            if (error instanceof RuntimeError) {
                runtimeError(error as RuntimeError);
            } else {
                throw error
            }

        }
    }

    evaluate(expr: Expr.Expr): Object {
        return expr.accept(this);
    }

    execute(stmt: Stmt.Stmt) {
        stmt.accept(this);
    }

    resolve(expr: Expr.Expr, depth: number) {
        this.locals.set(expr, depth);
    }

    executeBlock(statements: Stmt.Stmt[], environment: Environment) {
        let previous: Environment = this.environment;
        try {
            this.environment = environment;

            for (let statement of statements) {
                this.execute(statement);
            }
        } catch (error) {
            throw error
        } finally {
            this.environment = previous;
        }
    }

    visitAssignExpr(expr: Expr.Assign): Object {
        const value: Object = this.evaluate(expr.value);

        let distance = this.locals.get(expr);
        if (distance != null) {
            this.environment.assignAt(distance, expr.name, value);
        } else {
            this.globals.assign(expr.name, value);
        }

        return value;
    }
    visitBinaryExpr(expr: Expr.Binary): Object {
        const left: Object = this.evaluate(expr.left)
        const right: Object = this.evaluate(expr.right)

        switch (expr.operator.type) {
            case TokenType.GREATER:
                checkNumberOrStringOperands(expr.operator, left, right);
                if ((typeof left == "number") && (typeof right == "number"))
                    return (left as number) > (right as number)
                if ((typeof left == "string") && (typeof right == "string"))
                    return (left as string) > (right as string)
            case TokenType.GREATER_EQUAL:
                checkNumberOrStringOperands(expr.operator, left, right);
                if ((typeof left == "number") && (typeof right == "number"))
                    return (left as number) >= (right as number)
                if ((typeof left == "string") && (typeof right == "string"))
                    return (left as string) >= (right as string)
            case TokenType.LESS:
                checkNumberOrStringOperands(expr.operator, left, right);
                if ((typeof left == "number") && (typeof right == "number"))
                    return (left as number) < (right as number)
                if ((typeof left == "string") && (typeof right == "string"))
                    return (left as string) < (right as string)
            case TokenType.LESS_EQUAL:
                checkNumberOrStringOperands(expr.operator, left, right);
                if ((typeof left == "number") && (typeof right == "number"))
                    return (left as number) <= (right as number)
                if ((typeof left == "string") && (typeof right == "string"))
                    return (left as string) <= (right as string)
            case TokenType.MINUS:
                checkNumberOperands(expr.operator, left, right);
                return (left as number) - (right as number)
            case TokenType.PLUS:
                if ((typeof left == "number") && (typeof right == "number")) {
                    return (left as number) + (right as number);
                }

                if ((typeof left == "string") && (typeof right == "string")) {
                    return (left as string) + (right as string);
                }
                throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.")

            case TokenType.SLASH:
                checkNumberOperands(expr.operator, left, right);
                return (left as number) / (right as number)
            case TokenType.STAR:
                checkNumberOperands(expr.operator, left, right);
                return (left as number) * (right as number)
            case TokenType.BANG_EQUAL: return !isEqual(left, right);
            case TokenType.EQUAL_EQUAL: return isEqual(left, right);

        }
        // Unreachable.
        return null as any;
    }
    visitTernaryExpr(expr: Expr.Ternary): Object {
        const test: Object = this.evaluate(expr.expression)

        if (isTruthy(test)) {
            return this.evaluate(expr.left);
        } else {
            return this.evaluate(expr.right);
        }
    }
    visitCallExpr(expr: Expr.Call): Object {
        let callee: Object = this.evaluate(expr.callee);

        let args: Object[] = []
        for (let arg of expr.args) {
            args.push(this.evaluate(arg));
        }

        if (!(isLoxCallable(callee))) {
            throw new RuntimeError(expr.paren, "Can only call functions and classes.");
        }

        let func: LoxCallable = callee as LoxCallable

        if (args.length != func.arity()) {
            throw new RuntimeError(expr.paren, "Expected " + func.arity() + " arguments but got " + args.length + ".");
        }

        return func.call(this, args);
    }
    visitGetExpr(expr: Expr.Get): Object {
        let object: Object = this.evaluate(expr.object);
        if (object instanceof LoxInstance) {
            return (object as LoxInstance).get(expr.name);
        }

        throw new RuntimeError(expr.name,
            "Only instances have properties.");
    }
    visitGroupingExpr(expr: Expr.Grouping): Object {
        return this.evaluate(expr.expression)
    }
    visitLiteralExpr(expr: Expr.Literal): Object {
        return expr.value
    }
    visitLogicalExpr(expr: Expr.Logical): Object {
        const left: Object = this.evaluate(expr.left);

        if (expr.operator.type == TokenType.OR) {
            if (isTruthy(left)) return left;
        } else {
            if (!isTruthy(left)) return left;
        }

        return this.evaluate(expr.right);
    }
    visitSetExpr(expr: Expr.Set): Object {
        let object: Object = this.evaluate(expr.object);

        if (!(object instanceof LoxInstance)) {
            throw new RuntimeError(expr.name, "Only instances have fields.");
        }

        let value: Object = this.evaluate(expr.value);
        (object as LoxInstance).set(expr.name, value);
        return value;
    }
    visitSuperExpr(expr: Expr.Super): Object {
        let distance = this.locals.get(expr);
        let superclass: LoxClass
        let object: LoxInstance
        if (distance !== undefined) {
            superclass = this.environment.getAt(distance, "super") as LoxClass;
            object = this.environment.getAt(distance - 1, "this") as LoxInstance;
            let method: LoxFunction = superclass.findMethod(expr.method.lexeme);

            if (method == null) {
                throw new RuntimeError(expr.method, "Undefined property '" + expr.method.lexeme + "'.");
            }

            return method.bind(object);
        }
        return null as any
    }
    visitThisExpr(expr: Expr.This): Object {
        return this.lookUpVariable(expr.keyword, expr)
    }
    visitUnaryExpr(expr: Expr.Unary): Object {
        const right: Object = this.evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.BANG:
                return !isTruthy(right)
            case TokenType.MINUS:
                checkNumberOperand(expr.operator, right)
                return -right as number;
        }

        return null as any;
    }

    visitVariableExpr(expr: Expr.Variable): Object {
        return this.lookUpVariable(expr.name, expr);
    }
    private lookUpVariable(name: Token, expr: Expr.Expr): Object {
        let distance = this.locals.get(expr);
        if (distance != null) {
            return this.environment.getAt(distance, name.lexeme);
        } else {
            return this.globals.get(name);
        }
    }

    visitBlockStmt(stmt: Stmt.Block): Object {
        this.executeBlock(stmt.statements, new Environment(this.environment))
        return null as any;
    }
    visitBreakStmt(stmt: Stmt.Break): Object {
        throw new BreakException()
    }
    visitContinueStmt(stmt: Stmt.Continue): Object {
        throw new ContinueException()
    }
    visitExitStmt(stmt: Stmt.Exit): Object {
        process.exit()
    }
    visitSwitchStmt(stmt: Stmt.Switch): Object {
        let executed: boolean = false;
        for (let caseStmt of stmt.cases) {
            if (isEqual(this.evaluate(caseStmt[0] as Expr.Expr), this.evaluate(stmt.expression))) {
                executed = true
                this.execute(caseStmt[1] as Stmt.Stmt)
                break
            }
        }
        if (!executed && stmt.defaultCase) {
            this.execute(stmt.defaultCase)
        }
        return null as any;
    }
    visitClassStmt(stmt: Stmt.Class): Object {
        let superclass: Object = null as any;
        if (stmt.superclass != null) {
            superclass = this.evaluate(stmt.superclass);
            if (!(superclass instanceof LoxClass)) {
                throw new RuntimeError(stmt.superclass.name, "Superclass must be a class.");
            }
        }

        this.environment.define(stmt.name.lexeme, null as any);

        if (stmt.superclass !== null) {
            this.environment = new Environment(this.environment);
            this.environment.define("super", superclass);
        }

        let methods: Map<string, LoxFunction> = new Map<string, LoxFunction>();
        for (let method of stmt.methods) {
            let func: LoxFunction = new LoxFunction(method, this.environment, method.name.lexeme === "init");
            methods.set(method.name.lexeme, func);
        }

        let klass: LoxClass = new LoxClass(stmt.name.lexeme, superclass as LoxClass, methods);

        if (superclass !== null) {
            this.environment = this.environment.enclosing;
        }

        this.environment.assign(stmt.name, klass);
        return null as any
    }
    visitExpressionStmt(stmt: Stmt.Expression): Object {
        this.evaluate(stmt.expression);
        return null as any;
    }
    visitFuncStmt(stmt: Stmt.Func): Object {
        let func: LoxFunction = new LoxFunction(stmt, this.environment, false);
        this.environment.define(stmt.name.lexeme, func);
        return null as any;
    }
    visitIfStmt(stmt: Stmt.If): Object {
        if (isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch != null) {
            this.execute(stmt.elseBranch);
        }
        return null as any;
    }
    visitPrintStmt(stmt: Stmt.Print): Object {
        const value: Object = this.evaluate(stmt.expression);
        console.log(stringify(value));
        return null as any
    }
    visitReturnStmt(stmt: Stmt.Return): Object {
        let value: Object = null as any;
        if (stmt.value != null) {
            value = this.evaluate(stmt.value)
        }

        throw new Return(value)
    }
    visitVarStmt(stmt: Stmt.Var): Object {
        let value: Object = null as any;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }
        this.environment.define(stmt.name.lexeme, value);
        return null as any;
    }
    visitWhileStmt(stmt: Stmt.While): Object {
        try {
            while (isTruthy(this.evaluate(stmt.condition))) {
                try {
                    this.execute(stmt.body);
                } catch (error) {
                    if (error instanceof ContinueException) {
                        continue;
                    } else {
                        throw error
                    }
                }
            }
        } catch (error) {
            if (error instanceof BreakException) {
                // do nothing
            } else {
                throw error;
            }
        }

        return null as any
    }
    visitForStmt(stmt: Stmt.For): Object {
        try {
            if (stmt.initializer != null) {
                this.execute(stmt.initializer)
            }
            while (isTruthy(this.evaluate(stmt.condition))) {
                try {
                    this.execute(stmt.body);
                } catch (error) {
                    if (error instanceof ContinueException) {
                        this.execute(stmt.increment);
                        continue;
                    } else {
                        throw error
                    }
                }
                if (stmt.increment != null) {
                    this.execute(stmt.increment);
                }
            }
        } catch (error) {
            if (error instanceof BreakException) {
                // do nothing
            } else {
                throw error;
            }
        }
        return null as any
    }
}

const isTruthy = (object: Object): boolean => {
    if (object == null) return false;
    if (typeof object == "boolean") return object as boolean;
    return true;
}

const isEqual = (a: Object, b: Object): boolean => {
    if (a == null && b == null) return true;
    if (a == null) return false;

    return a == b; // should I be concerned about differences between java's .equal() method and javascript's == operator? Perhaps I should use ===?
}

const stringify = (object: Object) => {
    if (object == null) return "nil";

    // I'm not sure that this is necessary in javascript
    if (typeof object == "number") {
        let text: string = object.toString();
        if (text.endsWith(".0")) {
            text = text.substring(0, text.length - 2);
        }
        return text;
    }
    return object.toString();
}

const checkNumberOperand = (operator: Token, operand: Object) => {
    if (typeof operand == "number") return;
    throw new RuntimeError(operator, "Operand must be a number.");
}

const checkNumberOperands = (operator: Token, left: Object, right: Object) => {
    if ((typeof left == "number") && (typeof right == "number")) return;
    throw new RuntimeError(operator, "Operands must be numbers.");
}

const checkNumberOrStringOperands = (operator: Token, left: Object, right: Object) => {
    if ((typeof left == "number") && (typeof right == "number")) return;
    if ((typeof left == "string") && (typeof right == "string")) return;
    throw new RuntimeError(operator, "Operands must be both numbers or both strings.");
}


