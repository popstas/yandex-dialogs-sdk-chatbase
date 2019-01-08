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
    ctx.chatbase.sendEvent(msg)
    return Reply.text(msg);
});
alice.listen(8080);
```