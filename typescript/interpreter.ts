import * as Expr from "./Expr"
import * as Stmt from "./Stmt"
import { TokenType } from "./tokenType"
import { Token } from "./token"
import { RuntimeError } from "./runtimeError"
import { runtimeError } from "./lox"
import { Environment } from "./environment"

class BreakException extends Error {}

export class Interpreter implements Expr.Visitor<Object>, Stmt.Visitor<Object>{
    private environment: Environment = new Environment()


    interpret(statements: Stmt.Stmt[]) {
        try {
            for (let statement of statements) {
                this.execute(statement);
            }
        } catch (error) {
            runtimeError(error);
        }
    }

    interpretExpression(expression: Expr.Expr) {
        try {
            const value: Object = this.evaluate(expression);
            console.log(stringify(value))
        } catch (error) {
            runtimeError(error);
        }
    }

    evaluate(expr: Expr.Expr): Object {
        return expr.accept(this);
    }

    execute(stmt: Stmt.Stmt) {
        stmt.accept(this);
    }

    executeBlock(statements: Stmt.Stmt[], environment: Environment) {
        let previous: Environment = this.environment;
        try {
            this.environment = environment;

            for (let statement of statements) {
                this.execute(statement);
            }
        } finally {
            this.environment = previous;
        }
    }

    visitAssignExpr(expr: Expr.Assign): Object {
        const value: Object = this.evaluate(expr.value);
        this.environment.assign(expr.name, value);
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
        return null;
    }
    visitTernaryExpr(expr: Expr.Ternary): Object {
        const test: Object = this.evaluate(expr.expression)

        if (isTruthy(test)) {
            const left: Object = this.evaluate(expr.left);
            return left
        } else {
            const right: Object = this.evaluate(expr.right);
            return right
        }
    }
    visitCallExpr(expr: Expr.Call): Object {
        throw new Error("Method not implemented.")
    }
    visitGetExpr(expr: Expr.Get): Object {
        throw new Error("Method not implemented.")
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
        throw new Error("Method not implemented.")
    }
    visitSuperExpr(expr: Expr.Super): Object {
        throw new Error("Method not implemented.")
    }
    visitThisExpr(expr: Expr.This): Object {
        throw new Error("Method not implemented.")
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

        // Unreachable.
        return null;
    }
    visitVariableExpr(expr: Expr.Variable): Object {
        return this.environment.get(expr.name)
    }
    visitBlockStmt(stmt: Stmt.Block): Object {
        this.executeBlock(stmt.statements, new Environment(this.environment));
        return null;
    }
    visitBreakStmt(stmt: Stmt.Break): Object {
        throw new BreakException();
    }
    visitContinueStmt(stmt: Stmt.Continue): Object {
        throw new Error("Method not implemented.")
    }
    visitDoWhileStmt(stmt: Stmt.DoWhile): Object {
        throw new Error("Method not implemented.")
    }
    visitExitStmt(stmt: Stmt.Exit): Object {
        throw new Error("Method not implemented.")
    }
    visitSwitchStmt(stmt: Stmt.Switch): Object {
        throw new Error("Method not implemented.")
    }
    visitClassStmt(stmt: Stmt.Class): Object {
        throw new Error("Method not implemented.")
    }
    visitExpressionStmt(stmt: Stmt.Expression): Object {
        this.evaluate(stmt.expression);
        return null; // do I need this?
    }
    visitFuncStmt(stmt: Stmt.Func): Object {
        throw new Error("Method not implemented.")
    }
    visitIfStmt(stmt: Stmt.If): Object {
        if (isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch != null) {
            this.execute(stmt.elseBranch);
        }
        return null;
    }
    visitPrintStmt(stmt: Stmt.Print): Object {
        const value: Object = this.evaluate(stmt.expression);
        console.log(stringify(value));
        return null; // do I need this?
    }
    visitReturnStmt(stmt: Stmt.Return): Object {
        throw new Error("Method not implemented.")
    }
    visitVarStmt(stmt: Stmt.Var): Object {
        let value: Object = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }
        this.environment.define(stmt.name.lexeme, value);
        return null;
    }
    visitWhileStmt(stmt: Stmt.While): Object {
        try{
            while (isTruthy(this.evaluate(stmt.condition))) {
                this.execute(stmt.body);
            }
        } catch (error) {
            // this catches break statements
            // do nothing
        }

        return null;
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


