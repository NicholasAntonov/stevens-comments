import m from 'mithril';

let loggedIn = m.prop(false);
check();

function check() {
  m.request({
   method: "GET",
   dataType: 'json',
   url: 'checkLogin.php'
 }).then((data) => loggedIn(JSON.parse(data)));
 console.log(loggedIn());
}

export default loggedIn;

export {check as check};
