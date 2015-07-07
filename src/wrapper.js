import m from 'mithril';

import {loggedIn} from './utility/login-controller';

import messageModal from './message-modal';
import navPanel from './nav-panel';
import authenticate from './authenticate';

export default {
  view: function (ctrl, args) {
    return m('.body', [
      m("header", [
        m("nav.top-nav", [
          m("h1.center-align", {onclick: () => m.route('/')}, [
            'S',
            m('span.half-size', 'tevens '),
            'C',
            m('span.half-size', 'ompliments and '),
            'C',
            m('span.half-size', 'rushes')
          ])
        ])
      ]),
      args.main,
      m("footer.page-footer", [
        m(".footer-copyright", [
          m(".center-align.valign", "© 2015 Nicholas Antonov & Brian Zawizawa for CS546 at Stevens")
        ])
      ]),
      loggedIn() ? navPanel : authenticate,
      messageModal
    ]);
  }
};
