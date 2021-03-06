import m from 'mithril';

import {check, login} from './utility/login-controller';

export default {
  controller: function () {
    let password = m.prop(''),
      email = m.prop(''),
      element = m.prop();



    return {
      password,
      email,
      element
    }
  },
  view: function (ctrl) {
    return m(".modal[id='login-modal']", [
      m(".modal-content", [
        m("h4", "Log In"),
        m("form.col.s12", {config: ctrl.element}, [
          m(".row", [
            m(".input-field.col.s12", [
              m("i.material-icons.prefix", "email"),
              m("input.validate[id='login-email'][required=''][type='email']", {onchange: m.withAttr('value', ctrl.email), value: ctrl.email()}),
              m("label[for='login-email']", "Email")
            ])
          ]),
          m(".row", [
            m(".input-field.col.s12", [
              m("i.material-icons.prefix", "lock_outline"),
              m("input.validate[id='login-password'][required=''][type='password']", {onchange: m.withAttr('value', ctrl.password), value: ctrl.password()}),
              m("label[for='login-password']", "Password")
            ])
          ])
        ])
      ]),
      m(".modal-footer", [
        m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right", {onclick: () => login(ctrl.element(), ctrl.email(), ctrl.password())},  "Log In")
      ])
    ]);
  }
};
