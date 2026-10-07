---
title: Client-Server Model
row: M1-L2.2
---
**In one sentence:** A client is any program that starts a conversation by sending a request, and a server is any program that waits for requests and sends back responses.

## What it is

A client is the side that asks. A browser is a client. So is a mobile app, a script run with `curl`, or one backend calling another backend. A server is the side that waits and answers. These are roles in one exchange, not fixed identities: a backend serving a frontend's requests can also act as a client when it calls an external weather API.

## Why an FDE needs this

When someone says "the server is down," you need to know which server they mean. A single request from a browser might pass through several server roles: a web server, a backend API, a database. Knowing client and server are roles, not permanent labels, lets you ask the right follow-up question instead of guessing at one box in the system.

## Key concepts

### Client and server are roles, not machine types

| Situation | Who is the client | Who is the server |
|---|---|---|
| You load a website | Your browser | The company's web server |
| A backend calls a weather API | Your backend | The weather company's server |
| You run `curl http://localhost:8000/health` | Your terminal | Your own local app |

## Common misconceptions

- **"A server is a physical machine."** A server is a role played by a program. One physical machine can run several server programs at once, each handling different requests.
- **"A backend is always a server, never a client."** A backend is a server to the frontend that calls it, but it becomes a client the moment it calls an external API or another backend.

## Typical interview questions

<details>
<summary>What is the difference between a client and a server?</summary>

A client is the program that starts a request. A server is the program that waits for requests and answers them. These are roles in a specific exchange, not fixed labels: a backend is a server to the frontend, but a client when it calls an external API.

</details>

<details>
<summary>Can the same program be both a client and a server?</summary>

Yes. A backend is a server when it answers the frontend, and a client when it calls an external service like a weather API. The role depends on which side of a given exchange the program is on.

</details>

## Learn more

- Article: [Client-Server overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview) (MDN, about 20 min).
- Article: [How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) (MDN, about 15 min).

## Related

- [IP Addresses and Ports](./02-dns-ip-ports.md)
- [Processes and Services](./03-processes-and-services.md)
- [Web App Layers](./10-frontend-backend-database-layers.md)
