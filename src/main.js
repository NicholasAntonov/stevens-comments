import m from 'mithril';

import loggedIn from './utility/login-controller';

import messageModal from './message-modal';
import navPanel from './nav-panel';
import authenticate from './authenticate';
import postBox from './post-box';
import postComponent from './post';

export default {
  controller: function () {
    let posts = m.prop([]);

    m.request({
      method: "GET",
      url: 'api/post.php',
      data: {
        comments: 10
      }
    }).then(posts);

    return {
      posts
    }
  },
  view: function (ctrl) {
    return [m("header", [
      m("nav.top-nav", [
        m("h1.center-align", "Stevens Compliments and Crushes")
      ])
    ]), m("main.container", [
      postBox,
      m("ul",
        ctrl.posts().map((post, postPageIndex) => m('li', m.component(postComponent, {post, postPageIndex})))
      )
    ]),
      m("footer.page-footer", [
        m(".footer-copyright", [
          m(".center-align.valign", "© 2015 Nicholas Antonov & Brian Zawizawa for CS546 at Stevens")
        ])
      ]),
    loggedIn() ? navPanel : authenticate,
    messageModal];
  }
};
