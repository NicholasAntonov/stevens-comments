import m from 'mithril';

import {posts, sortingByTop, sortByTop, sortByNew} from './utility/message-controller';

import wrapper from './wrapper';
import postBox from './post-box';
import postComponent from './post';

export default {
  view: function (ctrl) {
    return [
      m.component(wrapper, {main: m("main.container", [
        postBox,
        m("ul",
          posts().map((post, postPageIndex) => m('li', m.component(postComponent, {post, postPageIndex})))
        ),
        m('.mode-switcher.z-depth-2', [
          m(`a.waves-effect.waves-green.btn-flat${(sortingByTop()) ? '.green.lighten-2' : ''}`, {onclick: sortByTop}, 'Top'),
          m(`a.waves-effect.waves-green.btn-flat${(sortingByTop()) ? '' : '.green.lighten-2'}`, {onclick: sortByNew}, 'New'),
        ])
      ])})
    ];
  }
};
