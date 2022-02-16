import { isIndexSignatureDeclaration } from 'typescript';
import { error } from './lox';
import { TokenType } from './tokenType';
import { Token } from './token';

export class Scanner {
    private source: string
    private tokens: Token[] = []
    private start: number = 0;
    private current: number = 0;
    private line: number = 1;

    private keywords = new Map<String, TokenType>([
        ['and', TokenType.AND],
        ['break', TokenType.BREAK],
        ['continue', TokenType.CONTINUE],
        ['class', TokenType.CLASS],
        ['else', TokenType.ELSE],
        ['false', TokenType.FALSE],
        ['for', TokenType.FOR],
        ['fun', TokenType.FUN],
        ['if', TokenType.IF],
        ['nil', TokenType.NIL],
        ['or', TokenType.OR],
        ['print', TokenType.PRINT],
        ['return', TokenType.RETURN],
        ['super', TokenType.SUPER],
        ['this', TokenType.THIS],
        ['true', TokenType.TRUE],
        ['var', TokenType.VAR],
        ['while', TokenType.WHILE]
    ])


    constructor(source: string) {
        this.source = source
    }

    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current
            this.scanToken()
        }

        this.tokens.push(new Token(TokenType.EOF, "", null, this.line))
        return this.tokens
    }

    private isAtEnd() {
        return this.current >= this.source.length
    }

    private scanToken() {
        const c: string = this.advance()
        switch (c) {
            case '(': this.addToken(TokenType.LEFT_PAREN)
                break
            case ')': this.addToken(TokenType.RIGHT_PAREN)
                break
            case '{': this.addToken(TokenType.LEFT_BRACE)
                break
            case '}': this.addToken(TokenType.RIGHT_BRACE)
                break
            case ',': this.addToken(TokenType.COMMA)
                break
            case '.': this.addToken(TokenType.DOT)
                break
            case '-': this.addToken(TokenType.MINUS)
                break
            case '+': this.addToken(TokenType.PLUS)
                break
            case ';': this.addToken(TokenType.SEMICOLON)
                break
            case '*': this.addToken(TokenType.STAR)
                break
            case ':': this.addToken(TokenType.COLON)
                break
            case '?': this.addToken(TokenType.QUESTION)
                break

            // One or two character tokens.
            case '!': this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG)
                break
            case '=': this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL)
                break
            case '<': this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS)
                break
            case '>': this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER)
                break

            case '/':
                if (this.match('/')) {
                    while (this.peek() != '\n' && !this.isAtEnd()) {
                        this.advance()
                    }
                } else {
                    this.addToken(TokenType.SLASH)
                }
                break

            // ignore whitespace
            case ' ':
            case '\r':
            case '\t':
                break

            case '\n':
                this.line++
                break

            case '"': this.string()
                break


            default:
                if (this.isDigit(c)) {
                    this.number()
                } else if (this.isAlpha(c)) {
                    this.identifier()
                } else {
                    error(this.line, `Unexpected character: ${c}`)
                }
                break
        }
    }

    private advance() {
        return this.source[this.current++]
    }


    private addToken(type: TokenType = null, literal?: any) { // using a default parameter to avoid creating a new method
        const text = this.source.slice(this.start, this.current)
        this.tokens.push(new Token(type, text, literal, this.line))
    }

    private match(expected: string) {
        if (this.isAtEnd()) return false
        if (this.source[this.current] !== expected) return false
        this.current++
        return true
    }

    private peek() {
        if (this.isAtEnd()) return '\0'
        return this.source[this.current]
    }

    private peekNext() {
        if (this.current + 1 >= this.source.length) return '\0'
        return this.source[this.current + 1]
    }

    private string() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n') this.line++
            this.advance()
        }

        if (this.isAtEnd()) {
            error(this.line, "Unterminated string.")
            return
        }

        // The closing ".
        this.advance()

        // Trim the surrounding quotes.
        const value: string = this.source.slice(this.start + 1, this.current - 1)
        this.addToken(TokenType.STRING, value)
    }

    private number() {
        while (this.isDigit(this.peek())) {
            this.advance()
        }

        // Look for a fractional part.
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance()

            while (this.isDigit(this.peek())) {
                this.advance()
            }
        }

        this.addToken(TokenType.NUMBER, parseFloat(this.source.slice(this.start, this.current)))
    }

    private isDigit(c: string) {
        return c >= '0' && c <= '9'
    }

    private isAlpha(c: string) {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c == '_'
    }

    private isAlphaNumeric(c: string) {
        return this.isAlpha(c) || this.isDigit(c)
    }

    private identifier() {
        while (this.isAlphaNumeric(this.peek())) this.advance()
        
        const text = this.source.slice(this.start, this.current)
        let type = this.keywords.get(text)
        if (type == null) {
            type = TokenType.IDENTIFIER
        }
        this.addToken(type)
    }
}