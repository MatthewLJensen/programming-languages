"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var scanner_1 = require("./scanner");
var readline = require("readline-sync");
var Lox = /** @class */ (function () {
    function Lox() {
        this.hadError = false;
    }
    Lox.prototype.main = function (args) {
        if (args.length > 1) {
            console.log("Usage: tlox [script]");
            process.exit(64);
        }
        else if (args.length == 1) {
            this.runFile(args[0]);
        }
        else {
            this.runPrompt();
        }
    };
    Lox.prototype.runFile = function (path) {
        // const reader = new FileReader()
        // reader.onload = function(){
        //     const buffer = reader.result
        //     const bytes = new Uint8Array(buffer)
        // }
        // const bytes = fs.readFileSync(path)
        // const buffer = new Uint8Array(bytes)
        var buffer = fs.readFileSync(path).toString('utf-8');
        this.run(buffer);
        if (this.hadError)
            process.exit(65);
    };
    Lox.prototype.runPrompt = function () {
        while (true) {
            var line = readline.question('> ');
            switch (line) {
                case null:
                    break;
                default:
                    this.run(line);
                    this.hadError = false;
            }
        }
    };
    Lox.prototype.run = function (source) {
        var scanner = new scanner_1.Scanner(source);
        var tokens = scanner.scanTokens();
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            console.log(token);
        }
    };
    Lox.prototype.error = function (line, message) {
        this.report(line, "", message);
    };
    Lox.prototype.report = function (line, where, message) {
        console.error("[line " + line + "] Error " + where + ": " + message);
        this.hadError = true;
    };
    return Lox;
}());
exports.Lox = Lox;
var lox = new Lox();
lox.main(process.argv.slice(2)); //slice by 2 to get normalized arguments
//# sourceMappingURL=lox.js.map