import * as Expr from "./Expr"
import * as Stmt from "./Stmt"
import { Token } from "./token"
import { TokenType } from "./tokenType"

export class RpnPrinter implements Expr.Visitor<string> {

    rpnPrintExpr(expr: Expr.Expr): string {
        return expr.accept(this)
    }

    visitAssignExpr(expr: Expr.Assign): string {
        throw new Error("Method not implemented.");
    }

    //
    visitBinaryExpr(expr: Expr.Binary): string {
        return `${this.recurse(expr.left)} ${this.recurse(expr.right)} ${expr.operator.lexeme}`
    }

    visitCallExpr(expr: Expr.Call): string {
        throw new Error("Method not implemented.");
    }
    visitGetExpr(expr: Expr.Get): string {
        throw new Error("Method not implemented.");
    }

    //
    visitGroupingExpr(expr: Expr.Grouping): string {
        return `${this.recurse(expr.expression)}`
    }

    //
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

    //
    visitUnaryExpr(expr: Expr.Unary): string {
        return `${this.recurse(expr.right)} ${expr.operator.lexeme}`
    }


    visitVariableExpr(expr: Expr.Variable): string {
        throw new Error("Method not implemented.");
    }

    private recurse(expr: Expr.Expr) {
        return expr.accept(this)
    }

    private RPNize(name: string, ...exprs: Expr.Expr[]) {
        let output = ""
        for (const expr of exprs) {
            output += `${expr.accept(this)}`
        }
        output += ` ${name} `


        return output
    }

    // private transform(input: string, ...parts: Object[]){
    //     for (const part of parts){
    //         input += " "
    //         if (part instanceof Expr.Expr){
    //             input += part.accept(this)
    //         } else if (part instanceof Stmt){

    //         }
    //     }
    // }



}

// just for testing.

// function main() {
//     let expression: Expr.Expr = new Expr.Binary(
//         new Expr.Unary(
//             new Token(TokenType.MINUS, "-", null, 1),
//             new Expr.Literal(123)),
//         new Token(TokenType.STAR, "*", null, 1),
//         new Expr.Grouping(
//             new Expr.Literal(45.67)));

//     console.log(new AstPrinter().printExpr(expression));
// }

// main()