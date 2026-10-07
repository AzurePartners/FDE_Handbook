---
title: IP Addresses and Ports
row: M1-L2.2
---
**In one sentence:** An IP address identifies a machine on a network, and a port number tells that machine which program should receive the traffic.

## What it is

Every machine on a network has an IP address, a number like `192.0.2.10` that identifies it, the way a street address identifies a building. IPv4 addresses are four numbers from 0 to 255 separated by dots; newer IPv6 addresses are longer and written in hexadecimal, like `2001:db8::1`. Some addresses are public and reachable from the internet; private ranges like `10.x.x.x` and `192.168.x.x` work only inside a home or company network. People usually type a domain name rather than an IP address; DNS (Domain Name System) translates it, as covered on [HTTPS, Domains and Certificates](../05-containers-deployment/07-domains-and-certificates.md).

An IP address gets you to the right machine, but a single machine can run many programs at once: a web server, a database, an internal tool. A port is a number, from 0 to 65535, that identifies a specific "door" on that machine for network traffic. Each server picks a port to listen on, so incoming traffic knows which program should handle it. Port 80 is the default for plain HTTP, and 443 for HTTPS. Typing `http://localhost:8000` means "go to this machine, and knock on door 8000."

`localhost` (or `127.0.0.1`) means "this same machine, and only this machine." A server bound to `localhost` cannot be reached from another computer. Binding to `0.0.0.0` means "listen on every network interface this machine has," which is what lets other machines, or a container's outside world, reach the server.

## Why an FDE needs this

A demo can work on your laptop and fail entirely in a client's environment, often for one of three reasons: the app is reached at the wrong IP address, a firewall blocking the port your app listens on, or a server bound to `localhost` instead of `0.0.0.0`. Each is a quick, separate check, once you know they are three different things.

## Key concepts

### Checking what is running, and on which port

```
# See if something is listening on port 8000 (Linux/Mac)
lsof -i :8000

# See if something is listening on port 8000 (Windows PowerShell)
Get-NetTCPConnection -LocalPort 8000

# Start a FastAPI app on a specific port
uvicorn main:app --port 8000
```

### Common ports worth recognizing

| Port | Typical use |
|---|---|
| 80 | Plain HTTP |
| 443 | HTTPS (encrypted HTTP) |
| 5432 | PostgreSQL database |
| 8000, 3000, 5000 | Common local development defaults |

### Connection failures by symptom

| Symptom | Likely cause |
|---|---|
| "Connection refused" | Nothing is listening on that port, or the server is bound to `localhost` only |
| Request hangs, then times out | A firewall is silently dropping traffic to the port |
| "Address already in use" on startup | Another process already holds the port |

## Common misconceptions

- **"localhost and 0.0.0.0 are interchangeable."** They are not. `localhost` restricts access to the same machine. `0.0.0.0` opens the server to any network interface, which matters once you move to a container or the cloud.
- **"A domain name is the same thing as an IP address."** A domain name is a human-readable label that DNS translates into an IP address before any connection can open.
- **"192.168.x.x addresses are reachable from anywhere."** They are private ranges, valid only inside a local network. Reaching such a machine from outside needs a public address or a tunnel.

## Typical interview questions

<details>
<summary>What is the difference between binding a server to localhost and to 0.0.0.0?</summary>

`localhost` accepts connections only from the same machine. `0.0.0.0` listens on every network interface, so other machines, or traffic from outside a container, can reach it.

</details>

<details>
<summary>What is a port, and why does a machine need more than one?</summary>

A port is a number that identifies which running program on a machine should receive a given piece of network traffic. A machine needs many ports because it can run many servers at once, for example a web server on port 80 and a database on port 5432, all sharing one IP address.

</details>

<details>
<summary>A teammate says "my server won't start, port 8000 is already in use." What do you check?</summary>

Check what is already listening on port 8000, using a command like `lsof -i :8000` or the PowerShell equivalent. Either stop that process, or start the new server on a different port.

</details>

## Learn more

- Article: [How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) (MDN, about 15 min).
- Article: [Client-Server overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview) (MDN, about 20 min).

## Related

- [Client-Server Model](./01-client-server-model.md)
- [Processes and Services](./03-processes-and-services.md)
- [Full Request Lifecycle](./11-full-request-lifecycle.md)
- [Port Mapping](../05-containers-deployment/03-port-mapping.md)
- [HTTPS, Domains and Certificates](../05-containers-deployment/07-domains-and-certificates.md)
