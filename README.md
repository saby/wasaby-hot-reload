# Wasaby Hot Reload

A set of utilities for continuous integration of program code changes onto a current project that is running as a client-side part of a local stand. 

Includes a server-side and a client-side 

**Responsible**: [Kolbeshin F.A.](https://online.sbis.ru/person/a433a212-4d92-4900-bc18-dca37052b171)

**[Technical documentation](https://online.sbis.ru/shared/disk/d1d2aa31-dbc5-4fcb-aa83-fdd74f883a8b)**

## Installation

    npm install

## Available scripts

- Build test application:

```
npm run build
```

- Run unit tests:

```
npm test
```

- Start hot reload server:

```
npm start
```

- Push random data to the hot reload server:

```
npm test:event-push
```

## Checks in browser

- [Server state page](http://localhost:8080/)

- To listen server events execute following code in console on server state page:
```
let channel = new EventSource('/channel');

channel.addEventListener('modules-changed', (event) => {
    console.log('Event received', event);
});

channel.onerror = (err) => {
    console.error('Something went wrong', err);
};
```


