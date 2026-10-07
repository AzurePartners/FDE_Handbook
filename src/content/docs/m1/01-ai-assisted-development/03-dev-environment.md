---
title: Development Environment
row: M1-L1.2
---
**In one sentence:** The development environment is the terminal, editor, project folder, installed packages, and configuration that code needs to run, and every AI coding tool works inside that same environment, not instead of it.

## What it is

Before code runs, it needs a place to live: a folder with a structure, a list of other people's code it depends on, and settings that change between your laptop and a client's server.

The terminal is a text window where you type commands directly to your computer. The IDE, an editor built for code, usually has a terminal built in. A project's structure is its folders and files: an entry point that starts the app, folders for source code and tests, and a few configuration files at the top.

Dependencies are other people's code your project needs, listed in a file like `requirements.txt`. A virtual environment is an isolated copy of Python and its packages for one project, so dependencies do not collide with another project's on the same machine. Environment variables are values that live outside your code, such as an API key, held locally in a `.env` file.

## Why an FDE needs this

An FDE is usually dropped into someone else's project on day one, not building from a blank folder. If you do not recognize a typical project's shape, you cannot find where to make a change. Install packages globally instead of in a virtual environment and you can silently break a different project. Miss environment variables and you risk hardcoding a client's API key into a file, which ends up in git history long after you rotate it.

## Key concepts

### Terminal and IDE

The terminal runs commands: starting a server, installing packages, running tests. The IDE is where you read and edit code.

### Project structure

```
myapp/
  app.py              entry point, starts the server
  requirements.txt    list of dependencies
  .env.example         template for env variables, safe to commit
  .env                 actual values, never committed
  .gitignore           tells git to ignore .env
  src/                 application code
  tests/               test files
```

### Dependencies and virtual environments

```bash
python -m venv .venv              # isolated environment for this project
source .venv/bin/activate         # turn it on (Windows: .venv\Scripts\activate)
pip install -r requirements.txt   # install this project's dependencies
```

Each project gets its own `.venv` folder. Installing a package inside it has no effect on any other project.

### Environment variables and .env

A `.env` file holds settings that should never be written directly into code:

```
PORT=8000
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
```

Code reads these at startup:

Python does not read `.env` by itself: `os.environ` only holds variables the shell exported or a tool such as `docker run --env-file .env` passed in. Locally, the `python-dotenv` package loads the file first:

```python
import os
from dotenv import load_dotenv   # pip install python-dotenv

load_dotenv()                    # copies .env values into os.environ
port = os.environ.get("PORT", "8000")
```

The `.env` file is listed in `.gitignore` so it never gets committed. A `.env.example`, with placeholder values, is committed instead, so anyone cloning the project knows what it needs.

## Common misconceptions

- **"It's simpler to just install packages globally."** It feels simpler for one project and causes real problems on a second needing a different version of the same package.
- **".env files are safe to commit, they're just settings."** They often hold real secrets. Removing them from the latest version does not remove them from git history.
- **"Environment variables only matter once deployed."** A missing or misspelled one is why "it works on my machine" and nowhere else.

## Typical interview questions

<details>
<summary>What is the difference between a dependency in requirements.txt and one installed globally?</summary>

A dependency in `requirements.txt` is scoped to that project's virtual environment and exact recorded version. A global package affects every project on the machine and can silently conflict with what another expects.

</details>

<details>
<summary>Why use a virtual environment instead of installing everything system-wide?</summary>

It isolates each project's dependencies so different projects can use conflicting versions of the same package, and a setup can be reproduced elsewhere.

</details>

<details>
<summary>What is an environment variable, and when would you use one instead of hardcoding a value?</summary>

A value supplied outside the code, read at startup. Use one for anything sensitive or that changes between environments, rather than a source file.

</details>

<details>
<summary>A teammate committed a .env file with a real API key. What should happen next?</summary>

Rotate the key immediately, anyone with repository access has already seen it. Remove the file and add it to `.gitignore`. A fix to the latest version is not enough, the key was exposed the moment it was pushed.

</details>

## Learn more

- Video: MIT Missing Semester 2026, [Introduction to the Shell](https://missing.csail.mit.edu/2026/course-shell/) and [Version Control and Git](https://missing.csail.mit.edu/2026/version-control/) (MIT, self-paced)
- Article: [The Twelve-Factor App, part III on config](https://12factor.net/config) (about 10 min)

## Related

- [AI Coding Workflow](./01-ai-coding-workflow.md)
- [Reading Code](./04-reading-code.md)
- [Context Management](./05-context-management.md)
- [Secrets Management](../04-git-debugging-testing-security/09-secrets-management.md)
- [Configuration](../05-containers-deployment/06-config-and-env-vars.md)
