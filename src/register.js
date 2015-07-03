import m from 'mithril';

import loggedIn, {check} from './utility/login-controller';

export default {
  controller: function () {
    let name = m.prop(''),
      password = m.prop(''),
      passwordConfirmation = m.prop(''),
      email = m.prop(''),
      element = m.prop();

      function register () {
        function nonJsonErrors (xhr) {
          return xhr.status > 200 ? JSON.stringify(xhr.responseText) : xhr.responseText;
        }

        if (password() !== passwordConfirmation()) {
          alert("passwords do not match")
        }

        if (element().checkValidity()) {
          $.ajax({
            type: 'POST',
            url: 'register.php',
            dataType: 'json',
            data: {
              name: name(),
              password: password(),
              email: email()
            },
            success: check
          });
        }
      }

    return {
      name,
      password,
      passwordConfirmation,
      email,
      register,
      element
    }
  },
  view: function (ctrl) {
    return m(".modal[id='register-modal']", [
      m(".modal-content", [
        m("h4", "Register"),
        m("form.col.s12", {config: ctrl.element}, [
          m(".row", [
            m(".input-field.col.s12", [
              m("i.material-icons.prefix", "account_circle"),
              m("input.validate[id='name'][required=''][pattern=.+ .+][type='text']", {onchange: m.withAttr("value", ctrl.name), value: ctrl.name()}),
              m("label[for='name']", "Name")
            ])
          ]),
          m(".row", [
            m(".input-field.col.s12", [
              m("i.material-icons.prefix", "lock_outline"),
              m("input.validate[id='password'][required=''][type='password']", {onchange: m.withAttr("value", ctrl.password), value: ctrl.password()}),
              m("label[for='password']", "Password")
            ])
          ]),
          m(".row", [
            m(".input-field.col.s12", [
              m("i.material-icons.prefix", "lock_outline"),
              m("input.validate[id='confirm-password'][required=''][type='password']", {onchange: m.withAttr("value", ctrl.passwordConfirmation), value: ctrl.passwordConfirmation()}),
              m("label[for='confirm-password']", "Confirm Password")
            ])
          ]),
          m(".row", [
            m(".input-field.col.s12", [
              m("i.material-icons.prefix", "email"),
              m("input.validate[id='email'][required=''][type='email']", {onchange: m.withAttr("value", ctrl.email), value: ctrl.email()}),
              m("label[for='email']", "Email")
            ])
          ])
        ])
      ]),
      m(".modal-footer", [
        m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right", {onclick: ctrl.register}, "Register")
      ])
    ]);
  }
};
