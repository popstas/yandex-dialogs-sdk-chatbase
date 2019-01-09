# yandex-dialogs-sdk-chatbase
[![npm version](https://badge.fury.io/js/yandex-dialogs-sdk-chatbase.svg)](https://badge.fury.io/js/yandex-dialogs-sdk-chatbase)

Отправляет данные диалогов в Google Chatbase.

Middleware for [yandex-dialogs-sdk](https://github.com/fletcherist/yandex-dialogs-sdk)

# Installation

`npm i yandex-dialogs-sdk-chatbase --save`    
`yarn add yandex-dialogs-sdk-chatbase`

# Usage

Get api key, add a bot here - https://chatbase.com/bots/main-page

```js
const { Alice } = require('yandex-dialogs-sdk');
const chatbase = require('yandex-dialogs-sdk-chatbase');

const alice = new Alice();
alice.use(chatbase('your_api_key'));

alice.any(ctx => {
    const msg = 'Hello';
    // перед ответом пользователю нужно вызывать этот метод с текстом ответа
    ctx.chatbase.sendEvent(msg);
    return Reply.text(msg);
});
alice.listen(8080);
```

# Advanced usage
Чтобы использовать chatbase на полную мощность, нужно разметить навык.

Подробнее об intents, not handled messages можно почитать в [chatbase quickstart](https://chatbase.com/documentation/quickstart).

### Intents (команды)
Нужно передавать распознанную команду как intent: `ctx.chatbase.setIntent('greeting')`.

### Not handled messages (непонятые сообщения)
Нужно отмечать их через `ctx.chatbase.setNotHandled()` или `ctx.chatbase.setHandled(false)`.

### Feedback (отзывы)
Отзывы можно помечать через `ctx.chatbase.setAsFeedback()`.

### Версия навыка
Версию можно передавать вторым параметром в конструкторе, либо через `ctx.chatbase.setVersion('1.2.3')`.

Пример с использованием всех возможностей:

```js
const { Alice } = require('yandex-dialogs-sdk');
const chatbase = require('yandex-dialogs-sdk-chatbase');
const packageJson = require('./package.json');

const alice = new Alice();
alice.use(chatbase('your_api_key', packageJson.version)); // версию можно указать в конструкторе

// можно указать версию навыка и так, но это избыточно
alice.use((ctx, next) => {
    ctx.chatbase.setVersion(packageJson.version);
    return next(ctx);
});

alice.command('спасибо', ctx => {
    const msg = 'Пожалуйста';

    ctx.chatbase.setIntent('thankyou')); // любую понятую команду надо размечать
    ctx.chatbase.setAsFeedback()); // оценочный запрос
    ctx.chatbase.sendEvent(msg); // перед ответом пользователю нужно вызывать этот метод с текстом ответа

    return Reply.text(msg);
});

alice.any(ctx => {
    const msg = 'Не понимаю';

    ctx.chatbase.setNotHandled(); // отмечаем непонятное
    ctx.chatbase.sendEvent(msg);

    return Reply.text(msg);
});
alice.listen(8080);
```
