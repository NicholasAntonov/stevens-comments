import m from 'mithril';

export default {
  view: function (ctrl) {
    return m('.login-box.z-depth-2', [
      m('a', [
        m("i.material-icons.side-icon", "message")
      ]),
      m('a', [
        m("i.material-icons.side-icon", "power_settings_new")
      ])
    ]);
  }
};