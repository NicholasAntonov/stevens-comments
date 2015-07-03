import m from 'mithril';

export default {
  view: function (ctrl) {
    return m(".modal[id='message-modal']", [
      m(".modal-content", [
        m("h4", "Private Message"),
        m("form", [
          m(".input-field.message-to", [
            m("input.validate[disabled=''][id='disabled'][type='text']"),
            m("label[for='disabled']", "Recipient")
          ]),
          m(".input-field", [
            m("textarea.materialize-textarea[id='message-textarea'][length='1000']"),
            m("label[for='message-textarea']", "Send a private message!")
          ]),
          m(".row", [
            m(".col.s12.m7", [
              m("div", [
                m("input[checked='checked'][id='message-anon'][name='named'][type='radio'][value='no']"),
                m("label[for='message-anon']", "Submit anonymously")
              ]),
              m("div", [
                m("input[id='message-name'][name='named'][type='radio'][value='yes']"),
                m("label[for='message-name']", "Submit with name")
              ])
            ]),
            m(".col.s12.m5", [
              m("button.btn.waves-effect.waves-light[name='action'][type='submit']", ["Send ",m("i.material-icons.right", "send")])
            ])
          ])
        ])
      ])
    ])
  }
};
