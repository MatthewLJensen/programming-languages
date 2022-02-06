import * as fs from 'fs';
import { Scanner } from './scanner';
import * as readline from 'readline';
import { Token } from './token';
import { TokenType } from './tokenType';
import { Expr } from "./Expr"
import { Stmt } from "./Stmt"
import { Parser } from "./parser"
import { AstPrinter } from "./AstPrinter"
import { RpnPrinter } from "./RpnPrinter"
import { RuntimeError } from './runtimeError';
import { Interpreter } from "./interpreter"

const interpreter: Interpreter = new Interpreter()
let hadError: boolean = false
let hadRuntimeError: boolean = false
const args = process.argv.slice(2)
let rpn = false

// check for --rpn flag. if it is present, print the RPN version of the expression.
if (args.length > 0 && args[0] === '--rpn') {
    rpn = true
    args.splice(0, 1)
}

if (args.length > 1) {
    console.log("Usage: tlox [script]")
    process.exit(64)
} else if (args.length == 1) {
    runFile(args[0])

} else {
    runPrompt()
}


function runFile(path: string) {
    const buffer = fs.readFileSync(path).toString('utf-8')

    run(buffer)
    if (hadError) process.exit(65);
    if (hadRuntimeError) process.exit(70);
}

function runPrompt() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false // prevents printing of first user input line within REPL
    })

    const prompt = () => {
        process.stderr.write("> ")
        rl.question('', line => {
            switch (line) {
                case null:
                    break
                default:
                    run(line)
                    hadError = false
            }
            prompt()
        })
    }
    prompt()
}

function run(source: string) {
    const scanner: Scanner = new Scanner(source)
    const tokens: Token[] = scanner.scanTokens()
    const parser: Parser = new Parser(tokens)
    const statements: Stmt[] = parser.parse()
    //const expression: Expr = parser.parse()
    


    // stop if there was a syntax error.
    if (hadError) return

    //console.log(new AstPrinter().printExpr(expression))
    if (rpn){
        //console.log(new RpnPrinter().rpnPrintExpr(expression))
    }
    else{
        interpreter.interpret(statements);
    }
}

export function error(line: number, message: string) {
    report(line, "", message)
}

export function runtimeError(error: RuntimeError) {
    console.log(error.message + "\n[line " + error.token.line + "]") // hopefully message is the right alternative for .getMessage in Java
    hadRuntimeError = true;
}

function report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error ${where}: ${message}`)
    hadError = true
}

export function tokenError(token: Token, message: string) {
    if (token.type == TokenType.EOF) {
        report(token.line, "at end", message)
    } else {
        report(token.line, "at '" + token.lexeme + "'", message)
    }
}


