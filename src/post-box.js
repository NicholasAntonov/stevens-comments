import m from 'mithril';

import loggedIn, {check} from './utility/login-controller';
import bind from './utility/bind';

import {openAuthentication} from './authenticate';

export default {
  controller: function () {
    let showName = m.prop(0),
      forName = m.prop(""),
      content = m.prop(""),
      element = m.prop();

    function tryPosting () {
      loggedIn() ? post() : openAuthentication();
    }

    function post () {
      if (element().checkValidity()) {
        console.log(showName());
        $.ajax({
          type: 'POST',
          url: 'userPost.php',
          dataType: 'json',
          data: {
            post: content(),
            for_name: forName(),
            showName: showName()
          },
          success: () => document.location.reload(true)
        });
      }
    }

    return {
      tryPosting,
      forName,
      content,
      showName,
      element
    }
  },
  view: function (ctrl) {
    return m("form.card-panel.hoverable", {config: ctrl.element}, [
      m(".input-field", [
        m("input[id='post-title'][type='text'][placeholder='Who are you complimenting?']", bind(ctrl.forName)),
        m("label[for='post-title']")
      ]),
      m(".input-field", [
        m("textarea.materialize-textarea[id='post-textarea'][length='1000']", bind(ctrl.content)),
        m("label[for='post-textarea']", "Submit a post!")
      ]),
      m(".row", [
        m(".col.s12.m8", [
          m("div", [
            m("input[checked='checked'][id='post-anon'][name='named'][type='radio'][value='0']"),
            m("label[for='post-anon']", "Submit anonymously")
          ]),
          m("div", [
            m("input[id='post-name'][name='named'][type='radio'][value='1']", {onchange: m.withAttr('checked', ctrl.showName)}),
            m("label[for='post-name']", "Submit with name")
          ])
        ]),
        m(".col.s12.m4", [
          m("button.btn.waves-effect.waves-light[name='action'][type='button']", {onclick: ctrl.tryPosting}, ["Post", m("i.material-icons.right", "message")])
        ])
      ])
    ]);
  }
};
