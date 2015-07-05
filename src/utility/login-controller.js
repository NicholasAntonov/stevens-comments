import m from 'mithril';

import {openAuthentication} from '../authenticate';

export const loggedIn = m.prop(false);
check();

export function check () {
  m.request({
   method: "GET",
   dataType: 'json',
   url: 'api/checkLogin.php'
 }).then((data) => loggedIn(JSON.parse(data)));
};

export function attempt (func) {
  const args = Array.prototype.slice.call(arguments, 1);
  return function () {
    loggedIn() ? func.apply(null, args) : openAuthentication();
  }
}

export function logout () {
  $.post('logout.php', check);
};
