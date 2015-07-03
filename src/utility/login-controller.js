import m from 'mithril';

let loggedIn = m.prop(false);
check();

export function check () {
  m.request({
   method: "GET",
   dataType: 'json',
   url: 'checkLogin.php'
 }).then((data) => console.log(loggedIn(JSON.parse(data))));
};

export function logout () {
  $.post('logout.php', check);
};

export default loggedIn;
