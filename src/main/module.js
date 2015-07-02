import m from 'mithril';

export default {
  controller: function () {
    let posts = m.request({
      method: "GET",
      url: 'post.php',
      deserialize: (value) => JSON.parse(value),
      data: {
        comments: 10
      }
    });

    let loggedIn = m.request({
      method: "GET",
      url: 'checkLogin.php',
      deserialize: (value) => JSON.parse(value)
    });

    let name = m.prop(''),
      password = m.prop(''),
      passwordConfirmation = m.prop(''),
      email = m.prop('');

    function register () {
      $.post('register.php', {
          name: name(),
          password: password(),
          email: email()
        }, function( data ) {
          m.request({
            method: "POST",
            url: 'checkLogin.php',
            extract: nonJsonErrors,
            deserialize: (value) => JSON.parse(value)
          }).then(loggedIn, (error) => console.log(error));
          console.log(loggedIn());
        });
    }

    function logout () {
      $.post('logout.php');
    }

    function nonJsonErrors (xhr) {
      return xhr.status > 200 ? JSON.stringify(xhr.responseText) : xhr.responseText;
    }

    return {
      posts,
      loggedIn,
      name,
      password,
      passwordConfirmation,
      email,
      register
    }
  },
  view: function (ctrl) {
    return [m("header", [
      m("nav.top-nav", [
        m("h1.center-align", "Stevens Compliments and Crushes")
      ])
    ]), m("main.container", [
      m("form.card-panel.hoverable", [
        m(".input-field", [
          m("input[id='post-title'][type='text'][placeholder='Who are you complimenting?']"),
          m("label[for='post-title']")
        ]),
        m(".input-field", [
          m("textarea.materialize-textarea[id='post-textarea'][length='1000']"),
          m("label[for='post-textarea']", "Submit a post!")
        ]),
        m(".row", [
          m(".col.s12.m8", [
            m("div", [
              m("input[checked='checked'][id='post-anon'][name='named'][type='radio'][value='no']"),
              m("label[for='post-anon']", "Submit anonymously")
            ]),
            m("div", [
              m("input[id='post-name'][name='named'][type='radio'][value='yes']"),
              m("label[for='post-name']", "Submit with name")
            ])
          ]),
          m(".col.s12.m4", [
            m("button.btn.waves-effect.waves-light[name='action'][type='submit']", ["Post",m("i.material-icons.right", "message")])
          ])
        ])
      ]),
      m("ul", ctrl.posts().map((post, postPageIndex) => m("li.submission.card-panel.hoverable", [
          m("h3", post.for_name),
          m(".vote.left", [
            m("i.small.material-icons", "thumb_up"),
            m("br"),
            m(".count.center-align", post.votes)
          ]),
          m("p.flow-text", [post.post ,m("a.quote-by[onclick='$(\'#message-modal\').openModal();'][title='Send a private message']", post.name)]),
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
                m("button.btn.waves-effect.waves-light[name='action'][type='submit']", ["Comment",m("i.material-icons.right", "chat_bubble")])
              ])
            ])
          ]),
          m(".comments-container", post.comments.map((comment) => m("blockquote", [comment.comment, m("br"), m("a.quote-by[onclick='$(\'#message-modal\').openModal();'][title='Send a private message']", comment.name)]))          )
        ]))
      )
    ]), m("footer.page-footer", [
      m(".footer-copyright", [
        m(".center-align.valign", "© 2015 Nicholas Antonov & Brian Zawizawa for CS546 at Stevens")
      ])
    ]),m(`.login-box.z-depth-2${ctrl.loggedIn()?"":".hidden"}`, {onclick: () => {$('#combo-modal').openModal();}}, [
      m("a", "Log in / Register")
    ]),m(`.login-box.z-depth-2${ctrl.loggedIn()?".hidden":""}`, {onclick: () => {alert('implement messages')}}, [
      [m("i.material-icons.side-icon", "message"), m("i.material-icons.side-icon", "power_settings_new")],
    ]),m(".modal[id='combo-modal']", [
      m(".modal-content", [
        m("p", "Thanks for using this site. To prevent abuse and allow for a rich featured experience, users are required to log in. Don't Worry! All your information will be kept anonymous as long as you choose to keep it that way.")
      ]),
      m(".modal-footer", [
        m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left]", {onclick: () => {$('#login-modal').openModal();}}, "Log In"),
        m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left", {onclick: () => {$('#register-modal').openModal();}}, "Register")
      ])
    ]),m(".modal[id='login-modal']", [
      m(".modal-content", [
        m("h4", "Log In"),
        m("form.col.s12", [
          m(".row", [
            m(".input-field.col.s12", [
              m("i.material-icons.prefix", "email"),
              m("input.validate[id='login-email'][type='email']"),
              m("label[for='login-email']", "Email")
            ])
          ]),
          m(".row", [
            m(".input-field.col.s12", [
              m("i.material-icons.prefix", "lock_outline"),
              m("input.validate[id='login-password'][type='password']"),
              m("label[for='login-password']", "Password")
            ])
          ])
        ])
      ]),
      m(".modal-footer", [
        m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right",  "Log In")
      ])
    ]),m(".modal[id='register-modal']", [
      m(".modal-content", [
        m("h4", "Register"),
        m("form.col.s12", [
          m(".row", [
            m(".input-field.col.s12", [
              m("i.material-icons.prefix", "account_circle"),
              m("input.validate[id='name'][required=''][pattern=.+ .+][type='text']", {onchange: m.withAttr("value", ctrl.name), value: ctrl.name()}),
              m("label[for='name']", "Name")
            ])
          ]),
          m(".row", [
            m(".input-field.col.s12", [
              m("i.material-icons.prefix", "lock_outline"),
              m("input.validate[id='password'][type='password']", {onchange: m.withAttr("value", ctrl.password), value: ctrl.password()}),
              m("label[for='password']", "Password")
            ])
          ]),
          m(".row", [
            m(".input-field.col.s12", [
              m("i.material-icons.prefix", "lock_outline"),
              m("input.validate[id='confirm-password'][type='password']", {onchange: m.withAttr("value", ctrl.passwordConfirmation), value: ctrl.passwordConfirmation()}),
              m("label[for='confirm-password']", "Confirm Password")
            ])
          ]),
          m(".row", [
            m(".input-field.col.s12", [
              m("i.material-icons.prefix", "email"),
              m("input.validate[id='email'][type='email']", {onchange: m.withAttr("value", ctrl.email), value: ctrl.email()}),
              m("label[for='email']", "Email")
            ])
          ])
        ])
      ]),
      m(".modal-footer", [
        m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right", {onclick: ctrl.register}, "Register")
      ])
    ]),,m(".modal[id='message-modal']", [
      m(".modal-content", [
        m("h4", "Message"),
        m("form", [
          m(".input-field.message-to", [
            m("input.validate[disabled=''][id='disabled'][type='text'][value='I am not editable']"),
            m("label[for='disabled']", "Recipient")
          ]),
          m(".input-field", [
            m("textarea.materialize-textarea[id='message-textarea'][length='1000']"),
            m("label[for='message-textarea']", "Submit a post!")
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
    ])];
  }
}
