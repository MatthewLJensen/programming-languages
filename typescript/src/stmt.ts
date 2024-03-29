import { Token } from "./token"
import * as Expr from "./expr"

 
export interface Visitor<R> {
    visitBlockStmt(stmt: Block): R
    visitClassStmt(stmt: Class): R
    visitExpressionStmt(stmt: Expression): R
    visitFuncStmt(stmt: Func): R
    visitIfStmt(stmt: If): R
    visitPrintStmt(stmt: Print): R
    visitReturnStmt(stmt: Return): R
    visitVarStmt(stmt: Var): R
    visitWhileStmt(stmt: While): R
    visitForStmt(stmt: For): R
    visitBreakStmt(stmt: Break): R
    visitContinueStmt(stmt: Continue): R
    visitExitStmt(stmt: Exit): R
    visitSwitchStmt(stmt: Switch): R
}

export abstract class Stmt {
    abstract accept<R>(visitor: Visitor<R>): R
}

export class Block extends Stmt {
    public statements: Stmt[]

    constructor(statements: Stmt[]) {
        super()
        this.statements = statements
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitBlockStmt(this)
        }
}

export class Class extends Stmt {
    public name: Token
    public superclass: Expr.Variable
    public methods: Func[]

    constructor(name: Token, superclass: Expr.Variable, methods: Func[]) {
        super()
        this.name = name
        this.superclass = superclass
        this.methods = methods
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitClassStmt(this)
        }
}

export class Expression extends Stmt {
    public expression: Expr.Expr

    constructor(expression: Expr.Expr) {
        super()
        this.expression = expression
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitExpressionStmt(this)
        }
}

export class Func extends Stmt {
    public name: Token
    public params: Token[]
    public body: Stmt[]

    constructor(name: Token, params: Token[], body: Stmt[]) {
        super()
        this.name = name
        this.params = params
        this.body = body
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitFuncStmt(this)
        }
}

export class If extends Stmt {
    public condition: Expr.Expr
    public thenBranch: Stmt
    public elseBranch: Stmt

    constructor(condition: Expr.Expr, thenBranch: Stmt, elseBranch: Stmt) {
        super()
        this.condition = condition
        this.thenBranch = thenBranch
        this.elseBranch = elseBranch
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitIfStmt(this)
        }
}

export class Print extends Stmt {
    public expression: Expr.Expr

    constructor(expression: Expr.Expr) {
        super()
        this.expression = expression
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitPrintStmt(this)
        }
}

export class Return extends Stmt {
    public keyword: Token
    public value: Expr.Expr

    constructor(keyword: Token, value: Expr.Expr) {
        super()
        this.keyword = keyword
        this.value = value
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitReturnStmt(this)
        }
}

export class Var extends Stmt {
    public name: Token
    public initializer: Expr.Expr

    constructor(name: Token, initializer: Expr.Expr) {
        super()
        this.name = name
        this.initializer = initializer
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitVarStmt(this)
        }
}

export class While extends Stmt {
    public condition: Expr.Expr
    public body: Stmt

    constructor(condition: Expr.Expr, body: Stmt) {
        super()
        this.condition = condition
        this.body = body
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitWhileStmt(this)
        }
}

export class For extends Stmt {
    public condition: Expr.Expr
    public body: Stmt
    public increment: Stmt
    public initializer: Stmt

    constructor(condition: Expr.Expr, body: Stmt, increment: Stmt, initializer: Stmt) {
        super()
        this.condition = condition
        this.body = body
        this.increment = increment
        this.initializer = initializer
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitForStmt(this)
        }
}

export class Break extends Stmt {

    constructor() {
        super()
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitBreakStmt(this)
        }
}

export class Continue extends Stmt {

    constructor() {
        super()
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitContinueStmt(this)
        }
}

export class Exit extends Stmt {

    constructor() {
        super()
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitExitStmt(this)
        }
}

export class Switch extends Stmt {
    public expression: Expr.Expr
    public cases: Array<(Stmt|Expr.Expr)>[]
    public defaultCase: Stmt

    constructor(expression: Expr.Expr, cases: Array<(Stmt|Expr.Expr)>[], defaultCase: Stmt) {
        super()
        this.expression = expression
        this.cases = cases
        this.defaultCase = defaultCase
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitSwitchStmt(this)
        }
}