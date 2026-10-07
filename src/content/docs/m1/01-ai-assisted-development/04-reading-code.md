---
title: Reading Code
row: M1-L1.3
---
**In one sentence:** Reading code is pattern recognition, spotting functions, variables, conditionals, loops, exceptions, and modules, patterns every mainstream language shares, so you do not need fluency in a language to trace what its code does.

## What it is

Most people assume reading code means knowing a language the way you know a spoken one, vocabulary and grammar memorized. That is not what an FDE needs day to day. Almost all code, in almost any language, is built from a small, repeating set of blocks: storing a value, bundling steps into a reusable unit, branching on a condition, repeating something, handling something going wrong, and pulling in code someone else wrote.

Once you can recognize those six shapes, you can follow the logic of code in a language you have never used, because the shapes look similar everywhere: a condition is some version of `if`, a loop is some version of `for` or `while`, an error handler is some version of `try`. The exact keywords change, the structure underneath does not. You are tracing structure, not translating syntax word for word.

## Why an FDE needs this

An FDE spends a large part of the job reading code someone else wrote, often in an unfamiliar language, under time pressure, in front of a client. Waiting to become fluent first is not realistic. What is realistic is finding the entry point and following one request through the functions it touches, without a course in that language. That skill is what lets an FDE trust or challenge what an AI tool says about a codebase, instead of taking its summary on faith.

## Key concepts

### The six building blocks

| Block | How to spot it |
|---|---|
| Variables | An assignment, `name = value` |
| Functions | `def` or `function`, a name, parentheses |
| Conditionals | `if`, `else`, `elif`, `switch` |
| Loops | `for` or `while` |
| Exceptions | `try`, `except`, `catch`, `raise` |
| Modules | `import`, `from`, `require` |

### Reading a real function

```python
import requests                    # module

def get_forecast(latitude, longitude):   # function
    url = "https://api.open-meteo.com/v1/forecast"  # variable
    params = {"latitude": latitude, "longitude": longitude,
              "daily": "temperature_2m_max"}
    try:                            # exception handling
        response = requests.get(url, params=params, timeout=10)
        if response.status_code != 200:   # conditional
            raise ValueError("forecast request failed")
        for temp in response.json()["daily"]["temperature_2m_max"]:  # loop
            print(temp)
        return response.json()
    except requests.Timeout:
        return None
```

Without prior Python experience: `get_forecast` takes a location, calls an outside service, checks whether it failed, loops over the daily temperatures, and returns `None` instead of crashing on a timeout. None of that required memorizing syntax, only recognizing the six shapes.

### A reading strategy

1. Find the entry point, the file or function where execution starts.
2. Pick one path through the code, one request or click, and follow only that first.
3. Note the shape of each block before worrying about exact syntax.
4. Check an AI tool's explanation against this structure.

## Common misconceptions

- **"You need to know a language fluently to read it."** Fluency helps you write idiomatic code faster. Tracing what existing code does only needs the six building blocks.
- **"Skimming names tells you what code does."** Names can mislead or go stale. You have to trace the actual control flow.
- **"If the AI explains the code, that's enough."** An explanation can be wrong. Run the code, or trace it yourself, to confirm it matches.

## Typical interview questions

<details>
<summary>Look at an unfamiliar function. How do you identify the loop, the conditional, and the exception handling?</summary>

Look for repeating keywords rather than translating every line: `for`/`while` for a loop, `if`/`else` for a conditional, `try`/`except` for exception handling. Exact syntax varies by language, but these shapes appear in almost every one.

</details>

<details>
<summary>You've never used the language a file is written in. How do you figure out what it does?</summary>

Find the entry point, follow one path rather than reading every line, and map what you see onto the six blocks.

</details>

<details>
<summary>How do you verify that an AI's explanation of code is correct?</summary>

Trace the code yourself against the structure the AI described, and where possible run it or write a small test to confirm the behavior matches.

</details>

<details>
<summary>What's the fastest way to find where a web request first enters a codebase?</summary>

Look for the route or endpoint definitions near the top-level app file, then follow that route's function through what it calls.

</details>

## Learn more

- Article: [MDN, JavaScript first steps](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting) (about 2 hours)
- Video: [MIT Missing Semester 2026, Debugging and Profiling](https://missing.csail.mit.edu/2026/debugging-profiling/) (MIT, self-paced)

## Related

- [AI Coding Tools](./02-tool-forms.md)
- [AI Code Review](./06-verify-dont-trust.md)
