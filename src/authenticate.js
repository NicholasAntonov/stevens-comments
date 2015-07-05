import m from 'mithril';

import register from './register';
import login from './login';

import loggedIn, {check} from './utility/login-controller';

export function openAuthentication () {
  $('#combo-modal').openModal();
}

export default {
  view: function (ctrl) {
    return m('.login-module-container', [
      m('.login-box.z-depth-2', {onclick: openAuthentication}, [
        m("a", "Log in / Register")
      ]),
      m(".modal[id='combo-modal']", [
        m(".modal-content", [
          m("p", "Welcome to Stevens Compliments and Crushes. To prevent abuse and allow for a rich fully-featured experience, users are required to log in. Don't Worry! All your information will be kept anonymous.")
        ]),
        m(".modal-footer", [
          m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left", {onclick: () => {$('#login-modal').openModal();}}, "Log In"),
          m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left", {onclick: () => {$('#register-modal').openModal();}}, "Register")
        ])
      ]),
      login,
      register
    ]);
  }
};
