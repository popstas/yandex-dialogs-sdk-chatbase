// отправляет данные в chatbase

module.exports = api_key => (ctx, next) => {
  if (!api_key) return next(ctx);

  const msgParams = {
    intent: '',
    handled: true,
    feedback: false,
    version: ''
  };

  // отправляет наполненное сообщение
  const sendMessage = (message, isUser, params) => {
    const msg = ctx.chatbase
      .newMessage()
      .setApiKey(api_key)
      .setMessage(message)
      .setPlatform(ctx.data.meta.client_id)
      .setTimestamp(Date.now().toString())
      .setUserId(ctx.userId)
      .setCustomSessionId(ctx.sessionId)
      .setMessageId(ctx.messageId);

    if (isUser) {
      msg.setAsTypeUser();
      if (params.intent) msg.setIntent(params.intent);
    }

    if (!params.handled) msg.setAsNotHandled();
    if (params.feedback) msg.setAsFeedback();
    if (params.version) msg.setVersion(params.version);

    return (
      msg
        .send()
        // .then(msg => console.log(msg.getCreateResponse()))
        .catch(err => console.error(err))
    );
  };

  ctx.chatbase = require('@google/chatbase');

  // указать намерение (команду)
  ctx.chatbase.setIntent = intent => {
    msgParams.intent = intent;
  };

  // непонятный боту ответ - not handled, по умолчанию всё считается понятым
  ctx.chatbase.setHandled = value => {
    msgParams.handled = value;
  };

  // отметить ответ как отзыв (например, "молодец" или "тупая")
  ctx.chatbase.setAsFeedback = () => {
    msgParams.feedback = true;
  };

  // версия бота
  ctx.chatbase.setVersion = version => {
    msgParams.version = version;
  };

  // функцию нужно вызвать в самом конце, перед отправкой ответа пользователю
  ctx.chatbase.sendEvent = async text => {
    if (ctx.message == 'ping') return;

    // запрос
    sendMessage(ctx.message, true, msgParams);

    // ответ
    sendMessage(text, false, msgParams);
  };

  return next(ctx);
};
