import m from 'mithril';

export default {
  controller: function (args) {

    function deleteComment () {
      $.ajax({
        type: 'POST',
        url: 'api/comment.php',
        dataType: 'json',
        data: {
          delete: args.comment.c_id
        },
        success: () => document.location.reload(true),
        error: (error) => console.log(error.responseText)
      });
    }

    return {
      deleteComment
    };
  },
  view: function (ctrl, args) {
    return m("blockquote", [
      ((args.comment.u_id !== -1) ? m("button.btn.waves-effect.waves-light.red.right.tight[type='button']", {onclick: ctrl.deleteComment}, ["", m("i.material-icons", "delete")]) : ""),
      args.comment.comment,
      m("br"),
      m("a.quote-by[title='Send a private message']", {onclick: () => { $('#message-modal').openModal()}}, args.comment.name)
    ]);
  }
};
