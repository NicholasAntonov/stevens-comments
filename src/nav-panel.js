import m from 'mithril';

import {logout} from './utility/login-controller';

export default {
  view: function (ctrl) {
    return m('.login-box.z-depth-2', [
      m('a', {onclick: () => m.route('/messages')}, [
        m("i.material-icons.side-icon", "message")
      ]),
      m('a', {onclick: logout}, [
        m("i.material-icons.side-icon", "power_settings_new")
      ])
    ]);
  }
};
