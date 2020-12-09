# Wasaby Hot Reload

Набор утилит для автоматизированной доставки изменений программного кода в приложение, запущенное в виде клиентской части (браузер) локального стенда.

Включает серверную и клиентскую часть.

**Ответственный**: [Мальцев А. А.](https://online.sbis.ru/person/f7d79d8e-a8df-4e7e-aaaa-8662ad3a2fa9)

**[Техническая документация](https://online.sbis.ru/shared/disk/d1d2aa31-dbc5-4fcb-aa83-fdd74f883a8b)**

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
