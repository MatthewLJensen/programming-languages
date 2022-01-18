"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var scanner_1 = require("./scanner");
var readline = require("readline-sync");
var hadError = false;
var args = process.argv.slice(2);
if (args.length > 1) {
    console.log("Usage: tlox [script]");
    process.exit(64);
}
else if (args.length == 1) {
    runFile(args[0]);
}
else {
    runPrompt();
}
function runFile(path) {
    var buffer = fs.readFileSync(path).toString('utf-8');
    run(buffer);
    if (hadError)
        process.exit(65);
}
function runPrompt() {
    while (true) {
        var line = readline.question('> ');
        switch (line) {
            case null:
                break;
            default:
                run(line);
                hadError = false;
        }
    }
}
function run(source) {
    var scanner = new scanner_1.Scanner(source);
    var tokens = scanner.scanTokens();
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        console.log(token);
    }
}
function error(line, message) {
    report(line, "", message);
}
exports.error = error;
function report(line, where, message) {
    console.error("[line " + line + "] Error " + where + ": " + message);
    hadError = true;
}
//# sourceMappingURL=lox.js.map