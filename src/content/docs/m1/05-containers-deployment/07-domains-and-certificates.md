---
title: HTTPS, Domains and Certificates
row: M1-L5.3
---
**In one sentence:** Once an app runs somewhere, it needs a human-readable address that DNS can translate, and a certificate proving that address is really it, so traffic can travel over encrypted HTTPS.

## What it is

A **domain** is a human-readable name, like `api.example.com`, for a server's numeric IP address. **DNS** (Domain Name System) is the lookup that translates the name into the address a computer connects to. It happens automatically before any HTTP request is sent, so a DNS failure shows up as "cannot connect at all," never as a status code.

Plain HTTP sends everything as readable text, including a password typed into a form. Anyone in between, on the same public Wi-Fi or a compromised router, can read or change it. **HTTPS** is HTTP layered on **TLS** (Transport Layer Security), which encrypts the connection and checks the server's identity before any HTTP data is sent. The check uses a **TLS certificate**, a file stating "this server controls this domain," signed by a **certificate authority** (CA), a trusted organization that verifies domain control before signing. Browsers ship with a list of trusted CAs and accept their certificates without a warning.

Azure App Service gives every app a default domain, like `client-app.azurewebsites.net`, with HTTPS already working. A custom domain, like `app.example.com`, needs DNS records and a certificate set up yourself.

## Why an FDE needs this

Custom domains are a common client request, and the client often does not realize it takes DNS changes at a registrar the FDE cannot access. Knowing to ask for an A or CNAME record turns a confusing wait into a checklist. Clients also ask "is this secure" or panic over a certificate warning, and an expired certificate is a classic outage: browsers refuse to connect even though the app runs fine.

## Key concepts

### How DNS resolution works

```
Browser needs app.example.com
        |
        v
Resolver asks DNS servers, which return the record
        |
        v
Connection opens to that IP address on port 443
        |
        v
TLS handshake, then the HTTP request
```

Answers are cached for a time set on each record (its TTL, time to live), which is why a DNS change can take minutes to hours to reach everyone.

### DNS records for a custom domain

| Record | Points to | Typical use |
|---|---|---|
| A | An IP address | A domain pointed at a fixed server address |
| CNAME | Another domain name | A domain pointed at a cloud platform's address, which can change |

DNS does not allow a CNAME at the apex (root) domain, like `example.com`, so an apex domain usually needs an A record. A platform typically also asks for a verification record confirming the owner requested the mapping.

### What HTTPS protects, and what it does not

| Protected | Not protected |
|---|---|
| Data cannot be read in transit | What the server does with data once received |
| Data cannot be silently altered in transit | Whether the site itself is trustworthy |
| The server's identity is checked against a certificate | Bugs in the app's own code |

### The TLS 1.3 handshake, in a few steps

1. The browser connects and sends its share of key material.
2. The server replies with its share; both sides now derive the same encryption keys.
3. The server sends its certificate, already encrypted under those keys.
4. The browser checks that a trusted CA signed it and that it covers the domain.
5. HTTP requests and responses travel encrypted.

This takes a fraction of a second, before anything appears in a browser's Network tab.

### Certificates and renewal

A certificate covers only the domain names listed in it, and it has an expiry date. For a verified custom domain on the Basic tier or above, App Service can create a free **managed certificate** (not wildcard) that renews automatically while DNS stays correct. A hand-managed certificate must be renewed manually, or the domain starts failing HTTPS.

## Common misconceptions

- **"A custom domain and its certificate are automatic, like the default domain."** A custom domain needs DNS records proving ownership before the platform routes to it or issues a certificate.
- **"The padlock means the site is safe."** It means the connection is encrypted and the server's identity was verified. A scam site can have a padlock too.
- **"HTTPS is optional for an internal tool."** HTTP traffic travels in plain text regardless of audience.
- **"Once issued, a certificate never needs attention again."** Certificates expire. A managed one renews automatically while DNS stays valid; an unmanaged one needs renewing by hand.

## Typical interview questions

<details>
<summary>What is the difference between an A record and a CNAME record?</summary>

An A record points a domain at a numeric IP address. A CNAME points a domain at another domain name, the usual choice for a cloud platform, since the platform's address can change.

</details>

<details>
<summary>What does HTTPS protect, and what does it not protect?</summary>

It protects data in transit from being read or altered, and verifies the server's identity. It does not protect data once the server has it, and says nothing about whether the site is trustworthy.

</details>

<details>
<summary>What is a certificate authority, and why do browsers trust some certificates automatically?</summary>

A trusted organization that verifies a server controls a domain before signing its certificate. Browsers ship with a list of trusted authorities, so their certificates are accepted without a warning.

</details>

<details>
<summary>What happens, in order, during a TLS 1.3 handshake?</summary>

Both sides exchange key material and derive shared keys, the server sends its certificate encrypted under those keys, the browser checks the signature and domain, and then HTTP traffic flows encrypted.

</details>

<details>
<summary>A client's custom domain suddenly shows a certificate warning, even though the app is running. What would you check?</summary>

Whether the certificate expired and failed to renew, often because a DNS record it depended on changed or was removed. A managed certificate renews only while the domain still resolves correctly.

</details>

## Learn more

- Article: [Set up an existing custom domain name for your app](https://learn.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain) (Microsoft Learn).
- Article: [Install a TLS/SSL certificate for your app](https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate) (Microsoft Learn).
- Article: [Transport Layer Security](https://developer.mozilla.org/en-US/docs/Glossary/TLS) (MDN).

## Related

- [IP Addresses and Ports](../02-how-web-apps-run/02-dns-ip-ports.md)
- [Full Request Lifecycle](../02-how-web-apps-run/11-full-request-lifecycle.md)
- [API Authentication](../03-apis-data-integration/02-auth.md)
- [Configuration](./06-config-and-env-vars.md)
