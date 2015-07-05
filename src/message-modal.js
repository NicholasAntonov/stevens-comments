import m from 'mithril';

import bind from './utility/bind';

const target = m.prop();

export function openMessageModal (recipient) {
  target(recipient);
  $('#message-modal').openModal();
}

export default {
  controller: function () {
    const content = m.prop(''),
      showName = m.prop(false);

    function send () {
      $.ajax({
        type: 'POST',
        url: 'api/message.php',
        dataType: 'json',
        data: {
          to: target(),
          message: content(),
          showName: showName()
        },
        success: () => {
          Materialize.toast('Message sent!', 4000);
          content('');
          $('#message-modal').closeModal();
        },
        error: () => console.log(error.responseText)
      });
    }

    return {
      send,
      content,
      showName
    };
  },
  view: function (ctrl) {
    return m(".modal[id='message-modal']", [
      m(".modal-content", [
        m("h4", "Private Message"),
        m("form", [
          m(".input-field", [
            m("textarea.materialize-textarea[id='message-textarea'][length='1000']", bind(ctrl.content)),
            m("label[for='message-textarea']", "Send a private message!")
          ]),
          m(".row", [
            m(".col.s12.m7", [
              m("div", [
                m("input[checked='checked'][id='message-anon'][name='named'][type='radio'][value='no']"),
                m("label[for='message-anon']", "Submit anonymously")
              ]),
              m("div", [
                m("input[id='message-name'][name='named'][type='radio'][value='yes']", {onchange: m.withAttr('checked', ctrl.showName)}),
                m("label[for='message-name']", "Submit with name")
              ])
            ]),
            m(".col.s12.m5", [
              m("button.btn.waves-effect.waves-light[name='action'][type='button']", {onclick: ctrl.send}, [
                "Send ",
                m("i.material-icons.right", "send")
              ])
            ])
          ])
        ])
      ])
    ])
  }
};
