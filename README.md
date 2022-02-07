# Crafting an Interpreter
I'm following the journey laid out by Robert Nystrom in his book titled ["Crafting Interpreters"](https://craftinginterpreters.com/). I'm implementing his Lox interpreter within TypeScript.

## Testing
To test my interpreter, I created a script in the test directory. It's called test_tlox.mjs. It runs the interpreter via an executable as a child process and passes it tests and checks its output against the expected result. The tests show up in arrays at the top of the file.
To run this tester, go into the test directory and run:
```
node test_tlox.mjs
```
If it doesn't work, check that the executable is configured to be executable. In order to do this, run:
```
chmod +x tlox
```

## Challenges
- [x] 4.  [**Scanning**](http://www.craftinginterpreters.com/scanning.html)
  - Challenge 1: Nothing to implement.
  - Challenge 2: Nothing to implement.
  - Challenge 3: Nothing to implement.
  - [ ] Challenge 4: C-style /* ... */ block comments.

- [x] 5.  [**Representing Code**](http://www.craftinginterpreters.com/representing-code.html)
  - [ ] Challenge 1: Generate grammar without notational sugar
  - [ ] Challenge 2: Devise a complementary pattern (to the visitor pattern) for a functional language
  - [x] Challenge 3: AST Printer In Reverse Polish Notation. (In order to start the interpreter in this mode, run it with the --rpn argument)
  - [x] GenerateAst tool

- [x] 6. [**Parsing Expressions**](http://www.craftinginterpreters.com/parsing-expressions.html) 
  - [ ] Challenge 1: Add prefix and postfix ++ and -- operators.
  - [x] Challenge 2: Add support for the C-style conditional or “ternary” operator `?:`
  - [ ] Challenge 3: Add error productions to handle each binary operator appearing without a left-hand operand.

- [x] 7. [**Evaluating Expressions**](http://www.craftinginterpreters.com/evaluating-expressions.html)
  - [x] Challenge 1: Allowing comparisons on types other than numbers could be useful.
  - [ ] Challenge 2: Many languages define + such that if either operand is a string, the other is converted to a string and the results are then concatenated.
  - [ ] Challenge 3: Change the implementation in visitBinary() to detect and report a runtime error when dividing by 0. 

- [x] 8. [**Statements and State**](http://www.craftinginterpreters.com/statements-and-state.html)
  - [x] Challenge 1: Add support to the REPL to let users type in both statements and expressions.
  - [ ] Challenge 2: Make it a runtime error to access a variable that has not been initialized or assigned to
  - Challenge 3: Nothing to implement.

- [ ] 9. [**Control Flow**](http://www.craftinginterpreters.com/control-flow.html)
  - Challenge 1: Nothing to implement.
  - Challenge 2: Nothing to implement.
  - [ ] Challenge 3: Add support for break statements.

- [ ] 10. [**Functions**](http://www.craftinginterpreters.com/functions.html)
  - Challenge 1: Nothing to implement.
  - [ ] Challenge 2: Add anonymous function (lambdas) syntax.
  - Challenge 3: Nothing to implement.

- [ ] 11. [**Resolving and Binding**](http://www.craftinginterpreters.com/resolving-and-binding.html)
  - Challenge 1: Nothing to implement.
  - Challenge 2: Nothing to implement.
  - [ ] Challenge 3: Extend the resolver to report an error if a local variable is never used.
  - [ ] Challenge 4: Store local variables in an array and look them up by index.

- [ ] 12. [**Classes**](http://www.craftinginterpreters.com/classes.html)
  - [ ] Challenge 1: Add class methods.
  - [ ] Challenge 2: Support getter methods.
  - Challenge 3: Nothing to implement.

- [ ] 13. [**Inheritance**](http://www.craftinginterpreters.com/inheritance.html)
  - [ ] Challenge 1: Multiple inheritance. *Nothing to implement...?*
  - [ ] Challenge 2: Reverse method lookup order in class hierarchy.
  - [ ] Challenge 3: Add your own features!
  
  Credit to Alejandro Martinez for his [checkbox readme](https://github.com/alexito4/slox/blob/master/README.md)
