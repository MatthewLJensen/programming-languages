import { Token } from "./token"

 
export interface Visitor<R> {
    visitAssignExpr(expr: Assign): R
    visitBinaryExpr(expr: Binary): R
    visitTernaryExpr(expr: Ternary): R
    visitCallExpr(expr: Call): R
    visitGetExpr(expr: Get): R
    visitGroupingExpr(expr: Grouping): R
    visitLiteralExpr(expr: Literal): R
    visitLogicalExpr(expr: Logical): R
    visitSetExpr(expr: Set): R
    visitSuperExpr(expr: Super): R
    visitThisExpr(expr: This): R
    visitUnaryExpr(expr: Unary): R
    visitVariableExpr(expr: Variable): R
}

export abstract class Expr {
    abstract accept<R>(visitor: Visitor<R>): R
}

export class Assign extends Expr {
    public name: Token
    public value: Expr

    constructor(name: Token, value: Expr) {
        super()
        this.name = name
        this.value = value
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitAssignExpr(this)
        }
}

export class Binary extends Expr {
    public left: Expr
    public operator: Token
    public right: Expr

    constructor(left: Expr, operator: Token, right: Expr) {
        super()
        this.left = left
        this.operator = operator
        this.right = right
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitBinaryExpr(this)
        }
}

export class Ternary extends Expr {
    public expression: Expr
    public left: Expr
    public right: Expr

    constructor(expression: Expr, left: Expr, right: Expr) {
        super()
        this.expression = expression
        this.left = left
        this.right = right
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitTernaryExpr(this)
        }
}

export class Call extends Expr {
    public callee: Expr
    public paren: Token
    public args: Expr[]

    constructor(callee: Expr, paren: Token, args: Expr[]) {
        super()
        this.callee = callee
        this.paren = paren
        this.args = args
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitCallExpr(this)
        }
}

export class Get extends Expr {
    public object: Expr
    public name: Token

    constructor(object: Expr, name: Token) {
        super()
        this.object = object
        this.name = name
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitGetExpr(this)
        }
}

export class Grouping extends Expr {
    public expression: Expr

    constructor(expression: Expr) {
        super()
        this.expression = expression
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitGroupingExpr(this)
        }
}

export class Literal extends Expr {
    public value: Object

    constructor(value: Object) {
        super()
        this.value = value
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitLiteralExpr(this)
        }
}

export class Logical extends Expr {
    public left: Expr
    public operator: Token
    public right: Expr

    constructor(left: Expr, operator: Token, right: Expr) {
        super()
        this.left = left
        this.operator = operator
        this.right = right
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitLogicalExpr(this)
        }
}

export class Set extends Expr {
    public object: Expr
    public name: Token
    public value: Expr

    constructor(object: Expr, name: Token, value: Expr) {
        super()
        this.object = object
        this.name = name
        this.value = value
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitSetExpr(this)
        }
}

export class Super extends Expr {
    public keyword: Token
    public method: Token

    constructor(keyword: Token, method: Token) {
        super()
        this.keyword = keyword
        this.method = method
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitSuperExpr(this)
        }
}

export class This extends Expr {
    public keyword: Token

    constructor(keyword: Token) {
        super()
        this.keyword = keyword
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitThisExpr(this)
        }
}

export class Unary extends Expr {
    public operator: Token
    public right: Expr

    constructor(operator: Token, right: Expr) {
        super()
        this.operator = operator
        this.right = right
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitUnaryExpr(this)
        }
}

export class Variable extends Expr {
    public name: Token

    constructor(name: Token) {
        super()
        this.name = name
    }

    accept = <R>(visitor: Visitor<R>): R => {
            return visitor.visitVariableExpr(this)
        }
}