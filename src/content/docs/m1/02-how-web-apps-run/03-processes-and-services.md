---
title: Processes and Services
row: M1-L2.2
---
**In one sentence:** A process is a running instance of a program, with its own memory, and it stays running only until something stops it, on purpose or by accident.

## What it is

A process is what the operating system creates when you start a program. Launch a backend with `python app.py`, and the OS allocates memory and CPU time to that running instance, calling it a process. The code on disk is not the same thing: a process can run code since edited on disk, without the running copy changing.

If you stop that process, the server is gone, even though the code still sits on disk. The process has to be restarted to pick up any changes.

A service usually means a process meant to keep running in the background and restart automatically if it crashes, often managed by the operating system or a container orchestrator. A process started by hand in a terminal has none of that automatic behavior.

## Why an FDE needs this

"I edited the code but nothing changed" is one of the most common early confusions on a client call, and the answer is almost always that the running process was never restarted. The fix is to restart it, not to re-check code for a bug that is not there.

## Key concepts

### Process versus code on disk

| Thing | What it is |
|---|---|
| Code on disk | Text files, does nothing on its own |
| Process | A running instance of that code, with memory and CPU time |
| Restarting | Stopping the old process and starting a new one from the current code |

## Common misconceptions

- **"Killing the terminal window always stops the server."** Depending on how it was started, a server process can keep running in the background after the terminal that launched it closes.
- **"Editing the code changes the running app immediately."** The running process already has the old code loaded in memory. It needs a restart to run the new version, unless a dev server like `uvicorn --reload` restarts it for you.

## Typical interview questions

<details>
<summary>What is a process, and how is it different from the code on disk?</summary>

A process is a running instance of a program, created by the operating system, with its own memory. The code on disk is just text files; edits made after a process starts do not affect the already-running process.

</details>

<details>
<summary>A client says "I edited the file but nothing changed." What is the most likely explanation?</summary>

The running process was never restarted, so it is still executing the old version loaded into memory when it started. Restarting the process picks up the current file on disk.

</details>

## Learn more

- Article: [Server-side web frameworks](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Web_frameworks) (MDN, about 25 min).

## Related

- [Client-Server Model](./01-client-server-model.md)
- [IP Addresses and Ports](./02-dns-ip-ports.md)
- [Images, Containers, Registries](../05-containers-deployment/01-images-containers-registries.md)
