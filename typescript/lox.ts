import { losses } from '@tensorflow/tfjs-node';
import * as fs from 'fs';
//import * as readline from 'readline';
import internal = require('stream');
import { Scanner } from './scanner';
import * as readline from 'readline-sync';
import { Token } from './token';

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
        // const bytes = fs.readFileSync(path)
        // const buffer = new Uint8Array(bytes)

        const buffer = fs.readFileSync(path).toString('utf-8')

        this.run(buffer)
        if (this.hadError) process.exit(65);
    }

    runPrompt() {


        while (true) {

            const line = readline.question('> ')
            switch (line) {
                case null:
                    break
                default:
                    this.run(line)
                    this.hadError = false
            }
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

const lox = new Lox()
lox.main(process.argv.slice(2)) //slice by 2 to get normalized arguments