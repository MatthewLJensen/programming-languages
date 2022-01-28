import * as Expr from "./Expr"
import * as Stmt from "./Stmt"
import { TokenType } from "./tokenType"

class Interpreter implements Expr.Visitor<Object>, Stmt.Visitor<Object>{
    visitAssignExpr(expr: Expr.Assign): Object {
        throw new Error("Method not implemented.")
    }
    visitBinaryExpr(expr: Expr.Binary): Object {
        const left: Object = evaluate(expr.left)
        const right: Object = evaluate(expr.right)

        switch (expr.operator.type) {
            case TokenType.GREATER:
                return (left as number) > (right as number)
            case TokenType.GREATER_EQUAL:
                return (left as number) >= (right as number)
            case TokenType.LESS:
                return (left as number) < (right as number)
            case TokenType.LESS_EQUAL:
                return (left as number) <= (right as number)

            case TokenType.MINUS:
                return (left as number) - (right as number)
            case TokenType.PLUS:
                if ((typeof left == "number") && (typeof right == "number")) {
                    return (left as number) + (right as number);
                }

                if ((typeof left == "string") && (typeof right == "string")) {
                    return (left as string) + (right as string);
                }
                break
            case TokenType.SLASH:
                return (left as number) / (right as number)
            case TokenType.STAR:
                return (left as number) * (right as number)
            case TokenType.BANG_EQUAL: return !isEqual(left, right);
            case TokenType.EQUAL_EQUAL: return isEqual(left, right);

        }

        // Unreachable.
        return null;
    }
    visitCallExpr(expr: Expr.Call): Object {
        throw new Error("Method not implemented.")
    }
    visitGetExpr(expr: Expr.Get): Object {
        throw new Error("Method not implemented.")
    }
    visitGroupingExpr(expr: Expr.Grouping): Object {
        return evaluate(expr.expression)
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
        const right: Object = evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.BANG:
                return !isTruthy(right)
            case TokenType.MINUS:
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

const evaluate = (expr: Expr.Expr): Object => {
    return expr.accept(this);
}

const isTruthy = (object: Object): boolean => {
    if (object == null) return false;
    if (object instanceof Boolean) return object as boolean;
    return true;
}

const isEqual = (a: Object, b: Object): boolean => {
    if (a == null && b == null) return true;
    if (a == null) return false;

    return a == b; // should I be concerned about differences between java's .equal() method and javascript's == operator? Perhaps I should use ===?
  }