import m from 'mithril';

import loggedIn from './utility/login-controller';

import messageModal from './message-modal';
import navPanel from './nav-panel';
import authenticate from './authenticate';
import postBox from './post-box';

export default {
  controller: function () {
    let posts = m.request({
      method: "GET",
      url: 'api/post.php',
      deserialize: (value) => JSON.parse(value),
      data: {
        comments: 10
      }
    });

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
      m("ul", ctrl.posts().map((post, postPageIndex) => m("li.submission.card-panel.hoverable", [
          m("h3", post.for_name),
          m(".vote.left", [
            m("i.small.material-icons", "thumb_up"),
            m("br"),
            m(".count.center-align", post.votes)
          ]),
          m("p.flow-text", [post.post , m("a.quote-by[title='Send a private message']",{onclick: () => { $('#message-modal').openModal()}}, post.name)]),
          m("form", [
            m(".input-field", [
              m(`textarea.materialize-textarea[id='post-textarea-${postPageIndex}'][length='1000']`),
              m(`label[for='post-textarea-${postPageIndex}']`, "Submit a comment")
            ]),
            m(".row", [
              m(".col.s12.m8", [
                m("div", [
                  m(`input[checked='checked'][id='post-anon-${postPageIndex}'][name='named'][type='radio'][value='no']`),
                  m(`label[for='post-anon-${postPageIndex}']`, "Submit anonymously")
                ]),
                m("div", [
                  m(`input[id='post-name-${postPageIndex}'][name='named'][type='radio'][value='yes']`),
                  m(`label[for='post-name-${postPageIndex}']`, "Submit with name")
                ])
              ]),
              m(".col.s12.m4", [
                m("button.btn.waves-effect.waves-light[name='action'][type='submit']", ["Comment", m("i.material-icons.right", "chat_bubble")])
              ])
            ])
          ]),
          m(".comments-container", post.comments.map((comment) => m("blockquote", [comment.comment, m("br"), m("a.quote-by[title='Send a private message']",{onclick: () => { $('#message-modal').openModal()}}, comment.name)]))          )
        ]))
      )
    ]), m("footer.page-footer", [
      m(".footer-copyright", [
        m(".center-align.valign", "© 2015 Nicholas Antonov & Brian Zawizawa for CS546 at Stevens")
      ])
    ]),
    loggedIn() ? navPanel : authenticate,
    messageModal];
  }
};
