import * as fs from 'fs';
import { arrayBuffer } from 'stream/consumers';
import * as readline from 'readline';
import internal = require('stream');

export class Lox {
    hadError: boolean = false

    main(args: string[]) {
        if (args.length > 1) {
            console.log("Usage: tlox [script]")
            process.exit(64)
        } else if (args.length == 1) {
            this.runFile(args[0])

        } else {
            this.runPrompt()
        }
    }

    runFile(path: string) {
        // const reader = new FileReader()
        // reader.onload = function(){
        //     const buffer = reader.result
        //     const bytes = new Uint8Array(buffer)
        // }
        const bytes = fs.readFileSync(path)
        const buffer = new Uint8Array(bytes)
        this.run(buffer)
        if (this.hadError) process.exit(65);
    }

    runPrompt() {
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        for (; ;) {

            rl.question('> ', (line) => {
                switch (line) {
                    case null:
                        rl.close()
                        break
                    default:
                        this.run(line)
                        this.hadError = false
                }
            })

        }
    }

    run(source: string) {
        const scanner: Scanner = new Scanner(source)
        const tokens: Token[] = scanner.scanTokens()

        for (let token of tokens) {
            console.log(token)
        }
    }

    error(line: number, message: string) {
        this.report(line, "", message)
    }

    report(line: number, where: string, message: string) {
        console.error(`[line ${line}] Error ${where}: ${message}`)
        this.hadError = true
    }
}
