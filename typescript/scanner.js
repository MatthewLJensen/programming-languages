"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lox_1 = require("./lox");
var tokenType_1 = require("./tokenType");
var token_1 = require("./token");
var Scanner = /** @class */ (function () {
    function Scanner(source) {
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.keywords = new Map([
            ['and', tokenType_1.TokenType.AND],
            ['class', tokenType_1.TokenType.CLASS],
            ['else', tokenType_1.TokenType.ELSE],
            ['false', tokenType_1.TokenType.FALSE],
            ['for', tokenType_1.TokenType.FOR],
            ['fun', tokenType_1.TokenType.FUN],
            ['if', tokenType_1.TokenType.IF],
            ['nil', tokenType_1.TokenType.NIL],
            ['or', tokenType_1.TokenType.OR],
            ['print', tokenType_1.TokenType.PRINT],
            ['return', tokenType_1.TokenType.RETURN],
            ['super', tokenType_1.TokenType.SUPER],
            ['this', tokenType_1.TokenType.THIS],
            ['true', tokenType_1.TokenType.TRUE],
            ['var', tokenType_1.TokenType.VAR],
            ['while', tokenType_1.TokenType.WHILE]
        ]);
        this.source = source;
    }
    Scanner.prototype.scanTokens = function () {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new token_1.Token(tokenType_1.TokenType.EOF, "", null, this.line));
        return this.tokens;
    };
    Scanner.prototype.isAtEnd = function () {
        return this.current >= this.source.length;
    };
    Scanner.prototype.scanToken = function () {
        var lox = new lox_1.Lox();
        var c = this.advance();
        switch (c) {
            case '(':
                this.addToken(tokenType_1.TokenType.LEFT_PAREN);
                break;
            case ')':
                this.addToken(tokenType_1.TokenType.RIGHT_PAREN);
                break;
            case '{':
                this.addToken(tokenType_1.TokenType.LEFT_BRACE);
                break;
            case '}':
                this.addToken(tokenType_1.TokenType.RIGHT_BRACE);
                break;
            case ',':
                this.addToken(tokenType_1.TokenType.COMMA);
                break;
            case '.':
                this.addToken(tokenType_1.TokenType.DOT);
                break;
            case '-':
                this.addToken(tokenType_1.TokenType.MINUS);
                break;
            case '+':
                this.addToken(tokenType_1.TokenType.PLUS);
                break;
            case ';':
                this.addToken(tokenType_1.TokenType.SEMICOLON);
                break;
            case '*':
                this.addToken(tokenType_1.TokenType.STAR);
                break;
            // One or two character tokens.
            case '!':
                this.addToken(this.match('=') ? tokenType_1.TokenType.BANG_EQUAL : tokenType_1.TokenType.BANG);
                break;
            case '=':
                this.addToken(this.match('=') ? tokenType_1.TokenType.EQUAL_EQUAL : tokenType_1.TokenType.EQUAL);
                break;
            case '<':
                this.addToken(this.match('=') ? tokenType_1.TokenType.LESS_EQUAL : tokenType_1.TokenType.LESS);
                break;
            case '>':
                this.addToken(this.match('=') ? tokenType_1.TokenType.GREATER_EQUAL : tokenType_1.TokenType.GREATER);
                break;
            case '/':
                if (this.match('/')) {
                    while (this.peek() != '\n' && !this.isAtEnd()) {
                        this.advance();
                    }
                }
                else {
                    this.addToken(tokenType_1.TokenType.SLASH);
                }
                break;
            // ignore whitespace
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;
            case '"':
                this.string();
                break;
            default:
                if (this.isDigit(c)) {
                    this.number();
                }
                else if (this.isAlpha(c)) {
                    this.identifier();
                }
                else {
                    lox.error(this.line, "Unexpected character: " + c);
                }
                break;
        }
    };
    Scanner.prototype.advance = function () {
        return this.source[this.current++];
    };
    Scanner.prototype.addToken = function (type, literal) {
        if (type === void 0) { type = null; }
        var text = this.source.slice(this.start, this.current);
        this.tokens.push(new token_1.Token(type, text, literal, this.line));
    };
    Scanner.prototype.match = function (expected) {
        if (this.isAtEnd())
            return false;
        if (this.source[this.current] !== expected)
            return false;
        this.current++;
        return true;
    };
    Scanner.prototype.peek = function () {
        if (this.isAtEnd())
            return '\0';
        return this.source[this.current];
    };
    Scanner.prototype.peekNext = function () {
        if (this.current + 1 >= this.source.length)
            return '\0';
        return this.source[this.current + 1];
    };
    Scanner.prototype.string = function () {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n')
                this.line++;
            this.advance();
        }
        if (this.isAtEnd()) {
            var lox = new lox_1.Lox();
            lox.error(this.line, "Unterminated string.");
            return;
        }
        // The closing ".
        this.advance();
        // Trim the surrounding quotes.
        var value = this.source.slice(this.start + 1, this.current - 1);
        this.addToken(tokenType_1.TokenType.STRING, value);
    };
    Scanner.prototype.number = function () {
        while (this.isDigit(this.peek())) {
            this.advance();
        }
        // Look for a fractional part.
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }
        this.addToken(tokenType_1.TokenType.NUMBER, parseFloat(this.source.slice(this.start, this.current)));
    };
    Scanner.prototype.isDigit = function (c) {
        return c >= '0' && c <= '9';
    };
    Scanner.prototype.isAlpha = function (c) {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c == '_';
    };
    Scanner.prototype.isAlphaNumeric = function (c) {
        return this.isAlpha(c) || this.isDigit(c);
    };
    Scanner.prototype.identifier = function () {
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }
        var text = this.source.slice(this.start, this.current);
        var type = this.keywords.get(text);
        if (type == null) {
            this.addToken(tokenType_1.TokenType.IDENTIFIER);
        }
        this.addToken(type);
    };
    return Scanner;
}());
exports.Scanner = Scanner;
//# sourceMappingURL=scanner.js.map