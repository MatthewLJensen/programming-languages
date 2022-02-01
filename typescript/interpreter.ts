import * as Expr from "./Expr"
import * as Stmt from "./Stmt"
import { TokenType } from "./tokenType"
import { Token } from "./token"
import { RuntimeError } from "./runtimeError"
import { runtimeError } from "./lox"

export class Interpreter implements Expr.Visitor<Object>, Stmt.Visitor<Object>{

    interpret(expression: Expr.Expr) {
        try {
            const value: Object = this.evaluate(expression);
            console.log(stringify(value));
        } catch (error) {
            //console.log(error)
            runtimeError(error);
        }
    }

    evaluate(expr: Expr.Expr): Object {
        return expr.accept(this);
    }

    visitAssignExpr(expr: Expr.Assign): Object {
        throw new Error("Method not implemented.")
    }
    visitBinaryExpr(expr: Expr.Binary): Object {
        const left: Object = this.evaluate(expr.left)
        const right: Object = this.evaluate(expr.right)

        switch (expr.operator.type) {
            case TokenType.GREATER:
                checkNumberOperands(expr.operator, left, right);
                return (left as number) > (right as number)
            case TokenType.GREATER_EQUAL:
                checkNumberOperands(expr.operator, left, right);
                return (left as number) >= (right as number)
            case TokenType.LESS:
                checkNumberOperands(expr.operator, left, right);
                return (left as number) < (right as number)
            case TokenType.LESS_EQUAL:
                checkNumberOperands(expr.operator, left, right);
                return (left as number) <= (right as number)

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



        if (test){
            const left: Object = this.evaluate(expr.left);
            return left
        }else{
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
        throw new Error("Method not implemented.")
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
        throw new Error("Method not implemented.")
    }

    visitBlockStmt(stmt: Stmt.Block): Object {
        throw new Error("Method not implemented.")
    }
    visitClassStmt(stmt: Stmt.Class): Object {
        throw new Error("Method not implemented.")
    }
    visitExpressionStmt(stmt: Stmt.Expression): Object {
        throw new Error("Method not implemented.")
    }
    visitFuncStmt(stmt: Stmt.Func): Object {
        throw new Error("Method not implemented.")
    }
    visitIfStmt(stmt: Stmt.If): Object {
        throw new Error("Method not implemented.")
    }
    visitPrintStmt(stmt: Stmt.Print): Object {
        throw new Error("Method not implemented.")
    }
    visitReturnStmt(stmt: Stmt.Return): Object {
        throw new Error("Method not implemented.")
    }
    visitVarStmt(stmt: Stmt.Var): Object {
        throw new Error("Method not implemented.")
    }
    visitWhileStmt(stmt: Stmt.While): Object {
        throw new Error("Method not implemented.")
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