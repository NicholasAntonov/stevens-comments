import m from 'mithril';

import wrapper from './wrapper';
import postBox from './post-box';
import postComponent from './post';

export default {
  controller: function () {
    const posts = m.prop([]),
      sortingByTop = m.prop(false);

    sortByNew();

    function sortByNew () {
      sortingByTop(false);
      updatePosts();
    }

    function sortByTop () {
      sortingByTop(true);
      updatePosts();
    }

    function updatePosts() {
      let data = {
        comments: 10
      };

      if (sortingByTop()) {
        data.top = true;
      }

      m.request({
        method: "GET",
        url: 'api/post.php',
        data
      }).then(posts);
    }

    return {
      sortByTop,
      sortByNew,
      sortingByTop,
      posts
    }
  },
  view: function (ctrl) {
    return [
      m.component(wrapper, {main: m("main.container", [
        postBox,
        m("ul",
          ctrl.posts().map((post, postPageIndex) => m('li', m.component(postComponent, {post, postPageIndex})))
        ),
        m('.mode-switcher.z-depth-2', [
          m(`a.waves-effect.waves-green.btn-flat${(ctrl.sortingByTop()) ? '.green.lighten-2' : ''}`, {onclick: ctrl.sortByTop}, 'Top'),
          m(`a.waves-effect.waves-green.btn-flat${(ctrl.sortingByTop()) ? '' : '.green.lighten-2'}`, {onclick: ctrl.sortByNew}, 'New'),
        ])
      ])})
    ];
  }
};
