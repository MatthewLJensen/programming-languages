import { Token } from "./token"

export class RuntimeError extends Error {
    token: Token // should be final 
  
    constructor(token: Token, message: string) {
      super(message);
      this.token = token;

      Object.setPrototypeOf(this, RuntimeError.prototype)
    }
  }