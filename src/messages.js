import m from 'mithril';

import wrapper from './wrapper';
import messageComponent from './message';

export default {
  controller: function (args) {
    const messages = m.prop([]);

    m.request({
      method: "GET",
      url: 'api/message.php',
      data: {
        start: 0,
        count: 10
      }
    }).then(messages);

    return {
      messages
    }
  },
  view: function (ctrl) {
    return [
      m.component(wrapper, {main: m("main.container", [
        m('ul',
          ctrl.messages().map((message) => m.component(messageComponent, {message}))
        )
      ])})
    ];
  }
};
