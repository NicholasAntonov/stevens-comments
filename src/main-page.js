import m from 'mithril';

import wrapper from './wrapper';
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
    return [
      m.component(wrapper, {main: m("main.container", [
        postBox,
        m("ul",
          ctrl.posts().map((post, postPageIndex) => m('li', m.component(postComponent, {post, postPageIndex})))
        )
      ])})
    ];
  }
};
