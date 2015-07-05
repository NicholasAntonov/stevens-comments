import m from 'mithril';

import {updatePosts} from './message-controller';

import {openAuthentication} from '../authenticate';

export const loggedIn = m.prop(false);
check();

export function login (element, email, password) {
  if (element.checkValidity()) {
    $.ajax({
      type: 'POST',
      url: 'api/login.php',
      dataType: 'json',
      data: {
        password,
        email
      },
      success: check
    });
  }
};

export function check () {
  m.request({
   method: "GET",
   dataType: 'json',
   url: 'api/checkLogin.php'
 }).then((data) => {
   loggedIn(JSON.parse(data));
   updatePosts();
 });
};

export function attempt (func) {
  const args = Array.prototype.slice.call(arguments, 1);
  return function () {
    loggedIn() ? func.apply(null, args) : openAuthentication();
  }
}

export function logout () {
  $.post('api/logout.php', check);
};
