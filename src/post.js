import m from 'mithril';

import bind from './utility/bind';

import commentComponent from './comment';

export default {
  controller: function (args) {

    let commentText = m.prop(''),
      showName = m.prop(0);

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

    function submitComment () {
      $.ajax({
        type: 'POST',
        url: 'api/comment.php',
        dataType: 'json',
        data: {
          p_id: args.post.p_id,
          comment: commentText(),
          showName: showName()
        },
        success: () => document.location.reload(true)
      });
    }

    return {
      commentText,
      deletePost,
      submitComment,
      showName
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
          m(`textarea.materialize-textarea[id='post-textarea-${args.postPageIndex}'][length='1000']`, bind(ctrl.commentText)),
          m(`label[for='post-textarea-${args.postPageIndex}']`, {onclick: ctrl.submitComment}, "Submit a comment")
        ]),
        m(".row", [
          m(".col.s12.m8", [
            m("div", [
              m(`input[checked='checked'][id='post-anon-${args.postPageIndex}'][name='named'][type='radio'][value='no']`),
              m(`label[for='post-anon-${args.postPageIndex}']`, "Submit anonymously")
            ]),
            m("div", [
              m(`input[id='post-name-${args.postPageIndex}'][name='named'][type='radio'][value='yes']`, {onchange: m.withAttr('checked', ctrl.showName)}),
              m(`label[for='post-name-${args.postPageIndex}']`, "Submit with name")
            ])
          ]),
          m(".col.s12.m4", [
            m("button.btn.waves-effect.waves-light[name='action'][type='button']", {onclick: ctrl.submitComment}, ["Comment", m("i.material-icons.right", "chat_bubble")])
          ])
        ])
      ]),
      m(".comments-container", args.post.comments.map((comment) => m.component(commentComponent, {comment, post: args.post})))
    ])
  }
};
