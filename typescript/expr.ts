import { Token } from './token';

abstract class Expr {
    class Binary extends Expr {
        constructor(left: Expr, operator: Token, right: Expr) {
            this.left = left
            this.operator = operator
            this.right = right
        }

    }
}