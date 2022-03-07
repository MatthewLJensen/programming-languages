import * as Expr from "./expr"
import * as Stmt from "./stmt"
import { Token } from "./token"
import { TokenType } from "./tokenType"

export class RpnPrinter implements Expr.Visitor<string> {
    rpnPrintExpr(expr: Expr.Expr): string {
        return expr.accept(this)
    }
    visitAssignExpr(expr: Expr.Assign): string {
        throw new Error("Method not implemented.");
    }
    visitBinaryExpr(expr: Expr.Binary): string {
        return `${this.recurse(expr.left)} ${this.recurse(expr.right)} ${expr.operator.lexeme}`
    }
    visitTernaryExpr(expr: Expr.Ternary): string {
        throw new Error("Method not implemented.")
    }
    visitCallExpr(expr: Expr.Call): string {
        throw new Error("Method not implemented.");
    }
    visitGetExpr(expr: Expr.Get): string {
        throw new Error("Method not implemented.");
    }
    visitGroupingExpr(expr: Expr.Grouping): string {
        return `${this.recurse(expr.expression)}`
    }
    visitLiteralExpr(expr: Expr.Literal): string {
        if (expr.value == null) return "nil"
        return expr.value.toString()
    }
    visitLogicalExpr(expr: Expr.Logical): string {
        return `${this.recurse(expr.left)} ${this.recurse(expr.right)} ${expr.operator.lexeme}`
    }
    visitSetExpr(expr: Expr.Set): string {
        throw new Error("Method not implemented.");
    }
    visitSuperExpr(expr: Expr.Super): string {
        throw new Error("Method not implemented.");
    }
    visitThisExpr(expr: Expr.This): string {
        throw new Error("Method not implemented.");
    }
    visitUnaryExpr(expr: Expr.Unary): string {
        if (expr.operator.type == TokenType.BANG) {
            return `${this.recurse(expr.right)} not`
        }else if (expr.operator.type == TokenType.MINUS) {
            return `${this.recurse(expr.right)} neg`
        }else {
            return `${this.recurse(expr.right)} ${expr.operator.lexeme}`
        }
    }


    visitVariableExpr(expr: Expr.Variable): string {
        throw new Error("Method not implemented.");
    }

    private recurse(expr: Expr.Expr) {
        return expr.accept(this)
    }
}