---
title: Port Mapping
row: M1-L5.1
---
**In one sentence:** A container's port is closed to the outside world until you explicitly connect it to a port on the host machine.

## What it is

A container runs in its own isolated network space. Even if the app inside listens on port 80, nothing outside can reach it unless that port is published to the host machine. `docker run -p 8000:80 my-app` does this: the left side, `8000`, is the **host port**, what people connect to. The right side, `80`, is the **container port**, what the app inside listens on. A request to `localhost:8000` gets forwarded to port `80` inside the container.

A Dockerfile's `EXPOSE 80` line only documents which port the app uses. It does not publish anything; publishing happens at run time with `-p`.

## Why an FDE needs this

"I can't reach the app" is one of the most common early container problems, and it is almost always a port issue, not a code bug. An FDE who can read `-p 8000:80` and know which side is which finds the cause in seconds instead of guessing at the code.

## Key concepts

### Two common mistakes

- **The app listens on `127.0.0.1` instead of `0.0.0.0` inside the container.** `127.0.0.1` only accepts connections from inside the same network namespace, which the host is not part of. The app must bind to `0.0.0.0` to accept connections through the published port.
- **Mixing up the order, or mapping the wrong container port.** `-p 8000:80` is host:container, not the reverse. If the app actually listens on port 8000, not 80, `-p 8000:80` sends traffic to a port nothing is listening on, and the connection fails like a closed port.

## Common misconceptions

- **"EXPOSE in the Dockerfile publishes the port."** It only documents it. Publishing happens with `-p` at run time.
- **"The host and container ports have to match."** They can differ. `-p 3000:8000` is valid: connect to `3000` on the host, and Docker forwards it to `8000` inside.

## Typical interview questions

<details>
<summary>In `docker run -p 8000:80 my-app`, what does each number mean?</summary>

`8000` is the host port, the one you connect to from outside. `80` is the port the app inside the container is actually listening on.

</details>

<details>
<summary>A container is running and the port looks correctly mapped, but the app is still unreachable. What would you check?</summary>

Whether the app inside the container is listening on `0.0.0.0` rather than `127.0.0.1`. Binding to `127.0.0.1` only accepts connections from inside the container itself, so the published port has nothing to forward to.

</details>

## Learn more

- Article: [Docker for Beginners: images, containers, ports, and volumes explained](https://dev.to/chetancodelrca/docker-for-beginners-images-containers-ports-and-volumes-explained-ee6) (DEV).

## Related

- [Images, Containers, Registries](./01-images-containers-registries.md)
- [IP Addresses and Ports](../02-how-web-apps-run/02-dns-ip-ports.md)
