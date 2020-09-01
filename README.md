# Wasaby Hot Reload

Мальцев А. А. / Утилита автоматизированной доставки изменений программного кода в приложение, запущенное в виде клиентской части (браузер) локального стенда.

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
