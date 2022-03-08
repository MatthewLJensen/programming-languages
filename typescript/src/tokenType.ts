export enum TokenType {
    // Single-character tokens.
    LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE,
    COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR, COLON, QUESTION,

    // One or two character tokens.
    BANG, BANG_EQUAL,
    EQUAL, EQUAL_EQUAL,
    GREATER, GREATER_EQUAL,
    LESS, LESS_EQUAL,

    //literals
    IDENTIFIER, STRING, NUMBER,

    // keywords

    AND, BREAK, CASE, CONTINUE, CLASS, DEFAULT, ELSE, EXIT, FALSE, FUN, FOR, IF, NIL, OR,
    PRINT, RETURN, SUPER, SWITCH, THIS, TRUE, VAR, WHILE,

    EOF
}