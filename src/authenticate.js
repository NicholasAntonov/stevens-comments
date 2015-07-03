import m from 'mithril';

import register from './register';

import loggedIn, {check} from './utility/login-controller';

export default {
  view: function (ctrl) {
    return m('.login-module-container', [
      m('.login-box.z-depth-2', {onclick: () => {$('#combo-modal').openModal();}}, [
        m("a", "Log in / Register")
      ]),
      m(".modal[id='combo-modal']", [
        m(".modal-content", [
          m("p", "Thanks for using this site. To prevent abuse and allow for a rich featured experience, users are required to log in. Don't Worry! All your information will be kept anonymous as long as you choose to keep it that way.")
        ]),
        m(".modal-footer", [
          m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left", {onclick: () => {$('#login-modal').openModal();}}, "Log In"),
          m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left", {onclick: () => {$('#register-modal').openModal();}}, "Register")
        ])
      ]),
      m(".modal[id='login-modal']", [
        m(".modal-content", [
          m("h4", "Log In"),
          m("form.col.s12", [
            m(".row", [
              m(".input-field.col.s12", [
                m("i.material-icons.prefix", "email"),
                m("input.validate[id='login-email'][type='email']"),
                m("label[for='login-email']", "Email")
              ])
            ]),
            m(".row", [
              m(".input-field.col.s12", [
                m("i.material-icons.prefix", "lock_outline"),
                m("input.validate[id='login-password'][type='password']"),
                m("label[for='login-password']", "Password")
              ])
            ])
          ])
        ]),
        m(".modal-footer", [
          m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right",  "Log In")
        ])
      ]),
      register
    ]);
  }
};
