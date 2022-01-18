import * as fs from 'fs';
import { Scanner } from './scanner';
import * as readline from 'readline';
import { Token } from './token';


let hadError: boolean = false
const args = process.argv.slice(2)

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
}

function runPrompt() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    const prompt = () => {
        rl.question('> ', line => {
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

    for (let token of tokens) {
        console.log(token.toString())
    }
}

export function error(line: number, message: string) {
    report(line, "", message)
}

function report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error ${where}: ${message}`)
    hadError = true
}


