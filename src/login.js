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
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify({
              name: name(),
              password: password(),
              email: email()
            }),
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
      m(".modal[id='register-modal']", [
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
      ])
    ]);
  }
};
