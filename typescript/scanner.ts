import { Lox } from './lox';

class Scanner {
    private source: string
    private tokens: Token[] = []
    private start: number = 0;
    private current: number = 0;
    private line: number = 1;

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
        let lox = new Lox()
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

            case '!': this.addToken(match('=') ? TokenType.BANG_EQUAL : TokenType.BANG)
                break
            case '=': this.addToken(match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL)
                break
            case '<': this.addToken(match('=') ? TokenType.LESS_EQUAL : TokenType.LESS)
                break
            case '>': this.addToken(match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER)
                break

            default:
                lox.error(this.line, `Unexpected character: ${c}`)
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

    private match(expected: string){
        
    }

}