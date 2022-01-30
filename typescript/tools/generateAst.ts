import { argv } from 'process'
import { writeFileSync } from 'fs'

const dependencies = [
    'import { Token } from "./token"'
]

const expressions = [
    "Assign   : Token name, Expr value",

    "Binary   : Expr left, Token operator, Expr right",

    "Ternary  : Expr expression, Expr left, Expr right",

    "Call     : Expr callee, Token paren, Expr[] args", //altered from book in 2 ways. Changed List<Expr> to Expr[] and arguments to args

    "Get      : Expr object, Token name",

    "Grouping : Expr expression", 
    
    "Literal  : Object value",

    "Logical  : Expr left, Token operator, Expr right",

    "Set      : Expr object, Token name, Expr value",

    "Super    : Token keyword, Token method",

    "This     : Token keyword",

    "Unary    : Token operator, Expr right",
    "Variable : Token name"
]

// this was using Java namespaces. I decided to import the Expr module as Expr, so everything is referenced as Expr., including the abstract Expr, Which looks like Expr.Expr
const statements = [
    "Block      : Stmt[] statements", // altered from book.
    //< block-ast
    /* Classes class-ast < Inheritance superclass-ast
          "Class      : Token name, List<Stmt.Function> methods",
    */
    //> Inheritance superclass-ast
    "Class      : Token name, Expr.Variable superclass," // altered from book
    + " Function[] methods", // altered from book
    //< Inheritance superclass-ast
    "Expression : Expr.Expr expression",
    //> Functions function-ast
    "Func   : Token name, Token[] params," //altered from book. Function changed to Func
    + " Stmt[] body", // altered from book
    //< Functions function-ast
    //> Control Flow if-ast
    "If         : Expr.Expr condition, Stmt thenBranch,"
    + " Stmt elseBranch",
    //< Control Flow if-ast
    /* Statements and State stmt-ast < Statements and State
       var-stmt-ast "Print      : Expr expression"
    */
    //> var-stmt-ast
    "Print      : Expr.Expr expression",
    //< var-stmt-ast
    //> Functions return-ast
    "Return     : Token keyword, Expr.Expr value",
    //< Functions return-ast
    /* Statements and State var-stmt-ast < Control Flow while-ast
          "Var        : Token name, Expr initializer"
    */
    //> Control Flow while-ast
    "Var        : Token name, Expr.Expr initializer",
    "While      : Expr.Expr condition, Stmt body"
]

function defineAST(outputDir: string, baseName: string, types: string[]) {
    let output = ""

    output += dependencies.join('\n')

    if (baseName == "Stmt"){
        output += '\nimport * as Expr from "./Expr"'
    }

    //Generate the visitor interfaces
    output += `\n\n ${defineVisitor(baseName, types)}`

    output += `\nexport abstract class ${baseName} {\n    abstract accept<R>(visitor: Visitor<R>): R\n}\n\n`

    for (const type of types) {
        const className = type.split(':')[0].trim()
        const fields = type.split(":")[1].trim()
        output += defineType(baseName, className, fields)
    }

    const path = `${baseName}.ts`
    // we don't need to use outputdir since we are going to store them all together.
    writeFileSync(path, output.trim(), { flag: 'w' })


}

function defineVisitor(baseName: string, types: string[]) {
    let output: string = `\nexport interface Visitor<R> {\n`

    for (const type of types) {
        const typeName = type.split(":")[0].trim()
        output += `    visit${typeName + baseName}(${baseName.toLowerCase()}: ${typeName}): R\n`
    }
    output += "}\n"

    return output
}

function defineType(baseName: string, className: string, fieldList: string) {
    let output = ""

    output += `export class ${className} extends ${baseName} {\n`

    // class members
    for (const field of fieldList.split(",")) {
        const name = field.trim().split(" ")[1]
        const type = field.trim().split(" ")[0]
        output += `    public ${name.trim()}: ${type}\n`
    }

    // constructor
    output += `\n    constructor(`
    
    // constructor parameters
    for (const field of fieldList.split(",")) {
        const name = field.trim().split(" ")[1]
        const type = field.trim().split(' ')[0]
        output += `${name.trim()}: ${type}, `
    }

    // trim off last ", " 
    output = output.substring(0, output.length - 1)

    // assignments
    output += `    ) {\n        super()\n`
    for (const field of fieldList.split(",")) {
        const name = field.trim().split(" ")[1]
        output += `        this.${name} = ${name}\n`
    }
    output += '    }\n\n'

    output += `    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visit${className + baseName}(this)
        }`

    output += '\n}\n\n'

    return output

}

const main = (): void => {
    const args = argv.slice(2)

    if (args.length !== 0) {
        console.log("Not specifying correct number of arguments. Usage: generateAST")
    } else {
        defineAST(args[0], 'Expr', expressions)
        defineAST(args[0], 'Stmt', statements)
    }

}

main()


