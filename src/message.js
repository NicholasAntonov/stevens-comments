import m from 'mithril';

import bind from './utility/bind';
import {openMessageModal} from './message-modal';
import {attempt} from './utility/login-controller';

export default {
  view: function (ctrl, args) {
    return m('article.submission.card-panel.hoverable', [
      m('.post-body', [
        m('p.flow-text', [
          args.message.message,
          m("a.quote-by[title='Send a private message']", {onclick: attempt(openMessageModal, args.message.ownage_id)}, args.message.name)
        ]),
      ])
    ])
  }
};
