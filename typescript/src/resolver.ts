import * as Expr from "./expr"
import * as Stmt from "./stmt"
import { Interpreter } from "./interpreter"
import { Token } from "./token"
import { tokenError } from "./errorHandling"

enum FunctionType {
    NONE,
    FUNCTION,
    INITIALIZER,
    METHOD
}

enum ClassType {
    NONE,
    CLASS
}



export class Resolver implements Expr.Visitor<Object>, Stmt.Visitor<Object>{
    private interpreter: Interpreter
    private scopes: Array<Map<String, Boolean>> = new Array<Map<String, Boolean>>()
    private currentFunction: FunctionType = FunctionType.NONE;
    private currentClass: ClassType = ClassType.NONE;

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }

    resolveArray(statements: Stmt.Stmt[]) {
        for (let statement of statements) {
            this.resolveStmt(statement);
        }
    }

    private resolveMixedArray(cases: Array<(Expr.Expr | Stmt.Stmt)>[]) {
        for (let singleCase of cases) {
            for (let statementOrExpr of singleCase) {
                if (statementOrExpr instanceof Expr.Expr) {
                    this.resolveExpr(statementOrExpr as Expr.Expr);
                } else {
                    this.resolveStmt(statementOrExpr as Stmt.Stmt);
                }
            }
        }
    }

    private resolveStmt(stmt: Stmt.Stmt) {
        stmt.accept(this);
    }

    resolveExpr(expr: Expr.Expr) {
        expr.accept(this);
    }
    private resolveFunction(func: Stmt.Func, type: FunctionType) {
        let enclosingFunction: FunctionType = this.currentFunction
        this.currentFunction = type;

        this.beginScope();
        for (let param of func.params) {
            this.declare(param);
            this.define(param);
        }
        this.resolveArray(func.body);
        this.endScope();
        this.currentFunction = enclosingFunction;
    }

    private beginScope() {
        this.scopes.push(new Map<String, Boolean>());
    }

    private endScope() {
        this.scopes.pop();
    }

    private declare(name: Token) {
        if (this.scopes.length === 0) return;

        let scope: Map<String, Boolean> = this.scopes[this.scopes.length - 1];

        if (scope.has(name.lexeme)) {
            tokenError(name, "Already a variable with this name in this scope.");
        }

        scope.set(name.lexeme, false);
    }

    private define(name: Token) {
        if (this.scopes.length === 0) return;
        this.scopes[this.scopes.length - 1].set(name.lexeme, true);
    }

    private resolveLocal(expr: Expr.Expr, name: Token) {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].has(name.lexeme)) {
                this.interpreter.resolve(expr, this.scopes.length - 1 - i);
                return;
            }
        }
    }

    visitBlockStmt(stmt: Stmt.Block): Object {
        this.beginScope();
        this.resolveArray(stmt.statements);
        this.endScope();
        return null as any;
    }

    visitClassStmt(stmt: Stmt.Class): Object {
        let enclosingClass: ClassType = this.currentClass
        this.currentClass = ClassType.CLASS
        this.declare(stmt.name)
        this.define(stmt.name)

        this.beginScope();
        this.scopes[this.scopes.length - 1].set("this", true);

        for (let method of stmt.methods) {
            let declaration: FunctionType = FunctionType.METHOD;
            if (method.name.lexeme === "init") {
                declaration = FunctionType.INITIALIZER;
            }
            this.resolveFunction(method, declaration);
        }
        this.currentClass = enclosingClass;
        this.endScope()

        return null as any
    }
    visitExpressionStmt(stmt: Stmt.Expression): Object {
        this.resolveExpr(stmt.expression);
        return null as any
    }
    visitFuncStmt(stmt: Stmt.Func): Object {
        this.declare(stmt.name);
        this.define(stmt.name);

        this.resolveFunction(stmt, FunctionType.FUNCTION);
        return null as any
    }
    visitIfStmt(stmt: Stmt.If): Object {
        this.resolveExpr(stmt.condition);
        this.resolveStmt(stmt.thenBranch);
        if (stmt.elseBranch != null) {
            this.resolveStmt(stmt.elseBranch)
        }
        return null as any
    }
    visitPrintStmt(stmt: Stmt.Print): Object {
        this.resolveExpr(stmt.expression);
        return null as any
    }
    visitReturnStmt(stmt: Stmt.Return): Object {
        if (this.currentFunction == FunctionType.NONE) {
            tokenError(stmt.keyword, "Can't return from top-level code.");
        }

        if (stmt.value != null) {
            if (this.currentFunction == FunctionType.INITIALIZER) {
                tokenError(stmt.keyword, "Can't return a value from an initializer.");
            }
            this.resolveExpr(stmt.value);
        }
        return null as any
    }
    visitVarStmt(stmt: Stmt.Var): Object {
        this.declare(stmt.name);
        if (stmt.initializer != null) {
            this.resolveExpr(stmt.initializer)
        }
        this.define(stmt.name);
        return null as any;
    }
    visitWhileStmt(stmt: Stmt.While): Object {
        this.resolveExpr(stmt.condition);
        this.resolveStmt(stmt.body);
        return null as any
    }
    visitForStmt(stmt: Stmt.For): Object {
        this.resolveExpr(stmt.condition);

        if (stmt.initializer != null)
            this.resolveStmt(stmt.initializer)
        if (stmt.increment != null)
            this.resolveStmt(stmt.increment)

        this.resolveStmt(stmt.body);
        return null as any
    }
    visitBreakStmt(stmt: Stmt.Break): Object {
        return null as any
    }
    visitContinueStmt(stmt: Stmt.Continue): Object {
        return null as any
    }
    visitExitStmt(stmt: Stmt.Exit): Object {
        return null as any
    }
    visitSwitchStmt(stmt: Stmt.Switch): Object {
        this.resolveExpr(stmt.expression);
        this.resolveMixedArray(stmt.cases);
        if (stmt.defaultCase != null) {
            this.resolveStmt(stmt.defaultCase);
        }
        return null as any
    }
    visitAssignExpr(expr: Expr.Assign): Object {
        this.resolveExpr(expr.value);
        this.resolveLocal(expr, expr.name);
        return null as any;
    }
    visitBinaryExpr(expr: Expr.Binary): Object {
        this.resolveExpr(expr.left)
        this.resolveExpr(expr.right)
        return null as any
    }
    visitTernaryExpr(expr: Expr.Ternary): Object {
        this.resolveExpr(expr.expression);
        this.resolveExpr(expr.left);
        this.resolveExpr(expr.right);
        return null as any
    }
    visitCallExpr(expr: Expr.Call): Object {
        this.resolveExpr(expr.callee)

        for (let arg of expr.args) {
            this.resolveExpr(arg)
        }

        return null as any
    }
    visitGetExpr(expr: Expr.Get): Object {
        this.resolveExpr(expr.object);
        return null as any
    }
    visitGroupingExpr(expr: Expr.Grouping): Object {
        this.resolveExpr(expr.expression);
        return null as any
    }
    visitLiteralExpr(expr: Expr.Literal): Object {
        return null as any
    }
    visitLogicalExpr(expr: Expr.Logical): Object {
        this.resolveExpr(expr.left)
        this.resolveExpr(expr.right)
        return null as any
    }
    visitSetExpr(expr: Expr.Set): Object {
        this.resolveExpr(expr.value);
        this.resolveExpr(expr.object);
        return null as any
    }
    visitSuperExpr(expr: Expr.Super): Object {
        throw new Error("Method not implemented.")
    }
    visitThisExpr(expr: Expr.This): Object {
        if (this.currentClass == ClassType.NONE) {
            tokenError(expr.keyword, "Can't use 'this' outside of a class.");
            return null as any
        }
        this.resolveLocal(expr, expr.keyword)
        return null as any
    }
    visitUnaryExpr(expr: Expr.Unary): Object {
        this.resolveExpr(expr.right);
        return null as any
    }

    visitVariableExpr(expr: Expr.Variable): Object {
        if (!(this.scopes.length === 0) && this.scopes[this.scopes.length - 1].get(expr.name.lexeme) === false) {
            tokenError(expr.name, "Can't read local variable in its own initializer.");
        }

        this.resolveLocal(expr, expr.name);
        return null as any
    }

}
