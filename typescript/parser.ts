import { Token } from "./token"
import { TokenType } from "./tokenType"
import { Expr, Grouping, Literal, Unary, Binary, Ternary, Variable, Assign } from "./Expr"
import { Stmt, Print, Expression, Var, Block } from "./Stmt"
import { tokenError } from './lox';

class ParseError extends Error { }
export class Parser {
    private tokens: Token[]
    private current: number = 0

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    private expression(): Expr {
        return this.assignment()
    }

    private declaration(): Stmt {
        try {
            if (this.match(TokenType.VAR)) return this.varDeclaration();
            return this.statement();
        } catch (error) {
            this.synchronize();
            return null;
        }
    }

    private statement(): Stmt {
        if (this.match(TokenType.PRINT)) return this.printStatement()
        if (this.match(TokenType.LEFT_BRACE)) return new Block(this.block())
        return this.expressionStatement()
    }

    private printStatement(): Stmt {
        let value: Expr = this.expression()
        this.consume(TokenType.SEMICOLON, "Expect ';' after value.")
        return new Print(value)
    }

    private varDeclaration(): Stmt {
        const name: Token = this.consume(TokenType.IDENTIFIER, "Expect variable name.");

        let initializer: Expr = null;
        if (this.match(TokenType.EQUAL)) {
            initializer = this.expression();
        }

        this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
        return new Var(name, initializer);
    }

    private expressionStatement(): Stmt {
        let expr: Expr = this.expression()
        this.consume(TokenType.SEMICOLON, "Expect ';' after expression.")
        return new Expression(expr)
    }

    private block(): Stmt[] {
        let statements: Stmt[] = []

        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }

        this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
        return statements;
    }

    private assignment(): Expr {
        let expr: Expr = this.ternaryConditional()

        if (this.match(TokenType.EQUAL)) {
            const equals: Token = this.previous();
            const value: Expr = this.assignment();

            if (expr instanceof Variable) {
                let name: Token = (expr as Variable).name;
                return new Assign(name, value);
            }

            this.error(equals, "Invalid assignment target."); // what number should equals be?
        }

        return expr;
    }

    private ternaryConditional(): Expr {
        let expr: Expr = this.equality()

        if (this.match(TokenType.QUESTION)) {
            let left: Expr = this.ternaryConditional()
            if (this.match(TokenType.COLON)) {
                let right: Expr = this.ternaryConditional()
                return new Ternary(expr, left, right)
            } else {
                throw this.error(this.peek(), "Expect '?' to have matching ':'.")
            }
        }
        return expr
    }

    private equality(): Expr {
        let expr: Expr = this.comparison()

        while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            let operator: Token = this.previous()
            let right: Expr = this.comparison()
            expr = new Binary(expr, operator, right)
        }

        return expr

    }

    private comparison(): Expr {
        let expr: Expr = this.term()

        while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            const operator: Token = this.previous()
            const right: Expr = this.term()
            expr = new Binary(expr, operator, right)
        }
        return expr
    }

    private term(): Expr {
        let expr: Expr = this.factor()

        while (this.match(TokenType.MINUS, TokenType.PLUS)) {
            const operator: Token = this.previous()
            const right: Expr = this.factor()
            expr = new Binary(expr, operator, right)
        }

        return expr
    }

    private factor(): Expr {
        let expr: Expr = this.unary()
        while (this.match(TokenType.SLASH, TokenType.STAR)) {
            const operator: Token = this.previous()
            const right: Expr = this.unary()
            expr = new Binary(expr, operator, right)
        }
        return expr
    }

    private unary(): Expr {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            const operator: Token = this.previous()
            const right: Expr = this.unary()
            return new Unary(operator, right)
        }

        return this.primary()
    }

    private primary(): Expr {
        if (this.match(TokenType.FALSE)) return new Literal(false)
        if (this.match(TokenType.TRUE)) return new Literal(true)
        if (this.match(TokenType.NIL)) return new Literal(null)

        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Literal(this.previous().literal)
        }

        if (this.match(TokenType.IDENTIFIER)) {
            return new Variable(this.previous());
        }

        if (this.match(TokenType.LEFT_PAREN)) {
            const expr = this.expression()
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
            return new Grouping(expr)
        }

        throw this.error(this.peek(), "Expect expression.")

    }

    parse(): Stmt[] {
        let statements: Stmt[] = []
        while (!this.isAtEnd()) {
            statements.push(this.declaration())
        }
        return statements
    }

    parseExpression(): Expr {
        try {
            return this.expression();
        } catch (error) {
            return null;
        }
    }

    private match(...types: TokenType[]): boolean {
        for (let type of types) {
            if (this.check(type)) {
                this.advance()
                return true
            }
        }
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false
        return this.peek().type == type
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++
        return this.previous()
    }

    private isAtEnd(): boolean {
        return this.peek().type == TokenType.EOF
    }

    private peek(): Token {
        return this.tokens[this.current]
    }

    private previous(): Token {
        return this.tokens[this.current - 1]
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance()
        throw this.error(this.peek(), message)
    }

    private error(token: Token, message: string): Error {
        tokenError(token, message)
        return new ParseError()
    }

    private synchronize() {
        this.advance()

        while (!this.isAtEnd()) {
            if (this.previous().type == TokenType.SEMICOLON) return

            switch (this.peek().type) {
                case TokenType.CLASS:
                case TokenType.FUN:
                case TokenType.VAR:
                case TokenType.FOR:
                case TokenType.IF:
                case TokenType.WHILE:
                case TokenType.PRINT:
                case TokenType.RETURN:
                    return
            }
            this.advance()
        }
    }
}

