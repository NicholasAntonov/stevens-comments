import m from 'mithril';

import commentComponent from './comment';

export default {
  controller: function (args) {

    function deletePost () {
      $.ajax({
        type: 'POST',
        url: 'api/userPost.php',
        dataType: 'json',
        data: {
          delete: args.post.p_id
        },
        success: () => document.location.reload(true)
      });
    }

    return {
      deletePost
    };
  },
  view: function (ctrl, args) {
    return m('article.submission.card-panel.hoverable', [
      m('h3', args.post.for_name),
      m('aside.vote.left', [
        m('i.small.material-icons', 'thumb_up'),
        m('br'),
        m('.count.center-align', args.post.votes)
      ]),
      m('.post-body', [
        m('p.flow-text', [
          args.post.post,
          m("a.quote-by[title='Send a private message']", {onclick: () => { $('#message-modal').openModal()}}, args.post.name)
        ]),
      ]),
      ((args.post.u_id !== -1) ? m("button.btn.waves-effect.waves-light.red.right.tight[type='button']", {onclick: ctrl.deletePost}, ["", m("i.material-icons", "delete")]) : ""),
      m("form", [
        m(".input-field", [
          m(`textarea.materialize-textarea[id='post-textarea-${args.postPageIndex}'][length='1000']`),
          m(`label[for='post-textarea-${args.postPageIndex}']`, "Submit a comment")
        ]),
        m(".row", [
          m(".col.s12.m8", [
            m("div", [
              m(`input[checked='checked'][id='post-anon-${args.postPageIndex}'][name='named'][type='radio'][value='no']`),
              m(`label[for='post-anon-${args.postPageIndex}']`, "Submit anonymously")
            ]),
            m("div", [
              m(`input[id='post-name-${args.postPageIndex}'][name='named'][type='radio'][value='yes']`),
              m(`label[for='post-name-${args.postPageIndex}']`, "Submit with name")
            ])
          ]),
          m(".col.s12.m4", [
            m("button.btn.waves-effect.waves-light[name='action'][type='submit']", ["Comment", m("i.material-icons.right", "chat_bubble")])
          ])
        ])
      ]),
      m(".comments-container", args.post.comments.map((comment) => m.component(commentComponent, {comment})))
    ])
  }
};
