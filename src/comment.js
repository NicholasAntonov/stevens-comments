import m from 'mithril';

export default {
  controller: function (ctrl) {
    return {

    };
  },
  view: function (ctrl, args) {
    return m("blockquote", [
      ((args.comment.c_id !== -1) ? m("button.btn.waves-effect.waves-light.red.right.tight[type='button']", {onclick: ctrl.deletePost}, ["", m("i.material-icons", "delete")]) : ""),
      args.comment.comment,
      m("br"),
      m("a.quote-by[title='Send a private message']", {onclick: () => { $('#message-modal').openModal()}}, args.comment.name)
    ]);
  }
};
