---
title: Web App Layers
row: M1-L2.1
---
**In one sentence:** A web app is not one program but a set of separate pieces, running in different places, that pass messages back and forth to produce one answer.

## What it is

When you open a web app, you are looking at the visible tip of a chain of separate pieces, each running somewhere different, each doing one job. The browser draws the page and reacts to your clicks. A frontend program, usually JavaScript, decides what to show and when to ask for data. An API is the doorway a backend exposes so other programs can ask it for things. The backend holds the real logic: it checks a request, decides what to do, and talks to a database and sometimes to other companies' services. The database stores information so it survives after the program stops running.

The everyday analogy is a restaurant. You, the browser, read a menu, the frontend, and tell a waiter what you want, a request to the API. The waiter does not cook; they carry your order to the kitchen, the backend, which checks the pantry, the database, and sometimes calls a supplier, an external service.

Each piece is a separate running program, often on a separate machine, and they only know about each other through defined messages sent over a network. That separation is deliberate: it lets each piece be built, deployed, and fixed on its own.

## Why an FDE needs this

A client says "the app is slow" or "the app is broken" and cannot tell you more. Your first job is to work out which piece is failing: rendering, the frontend never sending the request, slow backend logic, a locked database, or a down external service. Without a mental map of the pieces, you will guess randomly. With the map, one sharp question, "what does the Network tab show," narrows the problem to one box.

## Key concepts

### The pieces, in order

- **Browser**: requests a page and renders what it receives.
- **Frontend**: code that runs inside the browser and builds the screen.
- **API**: the contract a backend publishes, specific URLs, methods, and data shapes.
- **Backend**: server-side program that runs business logic and checks input.
- **Database**: where data is stored between requests.
- **External services**: other companies' systems reached over the internet.

### A simple architecture diagram

```
+-----------+        HTTP request         +-----------+
|  Browser  |  ------------------------->  |    API    |
| (frontend)|                              |           |
|           |  <-------------------------  |           |
+-----------+        HTTP response         +-----------+
                                                  |
                                                  v
                                          +---------------+
                                          |   Backend     |
                                          |   logic       |
                                          +---------------+
                                             |          |
                                             v          v
                                     +----------+  +---------------+
                                     | Database |  |   External    |
                                     |          |  |   services    |
                                     +----------+  +---------------+
```

The user clicks a button, the frontend sends a request to the API, the backend logic reads or writes the database and may call an external service, and a response travels back the same path in reverse.

## Common misconceptions

- **"The frontend and the backend are the same program."** They are separate programs, usually built by the same team. They only communicate through requests and responses.
- **"The API is the same thing as the backend."** The API is the doorway: the URLs and rules other programs use to reach the backend. The backend is everything behind that doorway.
- **"If the page loads, the whole system is working."** The page can load from cached files while the API, database, or an external service is completely down.

## Typical interview questions

<details>
<summary>Draw or describe the architecture of a typical web app.</summary>

Browser and frontend on the user's device, talking over HTTP to an API. The API hands requests to backend logic, which reads and writes a database and may call external services. Responses travel back through the same chain in reverse.

</details>

<details>
<summary>A client says their app is slow. Where do you start looking?</summary>

Open the browser's Network tab and time each request. If the request itself takes long, the problem is likely the backend, the database, or an external service. If the request is fast but the page still feels slow, the problem is likely frontend rendering.

</details>

<details>
<summary>Why do backend and database run as separate programs instead of one?</summary>

Separation lets each piece scale, fail, and get replaced independently. A backend can restart without losing stored data, because the database keeps running on its own.

</details>

## Learn more

- Article: [How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) (MDN, about 15 min).
- Article: [Server-side web frameworks](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Web_frameworks) (MDN, about 25 min).

## Related

- [Client-Server Model](./01-client-server-model.md)
- [Full Request Lifecycle](./11-full-request-lifecycle.md)
- [Logic Placement](./12-where-logic-belongs.md)
- [Relational Model](../03-apis-data-integration/09-relational-model.md)
