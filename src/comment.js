import m from 'mithril';

export default {
  view: function (ctrl, args) {
    return m("blockquote", [
      args.comment.comment,
      m("br"),
      m("a.quote-by[title='Send a private message']", {onclick: () => { $('#message-modal').openModal()}}, args.comment.name)
    ]);
  }
};
