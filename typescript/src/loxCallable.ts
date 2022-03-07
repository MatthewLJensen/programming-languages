import { Interpreter } from "./interpreter"

export interface LoxCallable {
    arity(): number
    call(interpreter: Interpreter, args: Object[]): Object
}

// used to be able to determine if an object implements the LoxCallable interface. Apparently this is the way. Ew.
export function isLoxCallable(obj: Object): obj is LoxCallable {
    return (obj as LoxCallable).call !== undefined
}