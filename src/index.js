import m from 'mithril';

$( document ).ready(() => {
	m.mount(document.body, {controller: () => {}, view: (c) => [m("header", [
			m("nav.top-nav", [
				m("h1.center-align", "\n      Stevens Compliments and Crushes\n    ")
			]),
			"\n"
		]),"\n",m("main.container", [
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
			m("ul", [
				m("li.submission.card-panel.hoverable", [
					m("h3", "Bewchy"),
					m(".vote.left", [
						m("i.small.material-icons", "thumb_up"),
						m("br"),
						m(".count.center-align", "13")
					]),
					m("p.flow-tex", ["Lorizzle ipsizzle dawg sizzle fo shizzle, adipiscing crunk. Nullam sapien velizzle, volutpat, shizzlin dizzle quizzle, gravida vizzle, dang. Pellentesque eget tortor. Sed erizzle. Rizzle black shizznit pizzle fo shizzle my nizzle tempizzle doggy. Maurizzle bow wow wow fo cool the bizzle. Funky fresh in tortizzle. Pellentesque you son of a bizzle rhoncizzle nisi. Dope check out this boom shackalack gangsta gangsta. My shizz dapibus. Fo shizzle mah nizzle fo rizzle, mah home g-dizzle tellizzle i'm in the shizzle, pretium the bizzle, mattizzle phat, eleifend fo shizzle mah nizzle fo rizzle, mah home g-dizzle, nunc. Fizzle suscipizzle. Nizzle pizzle sure sizzle purus. Fo shizzle mah nizzle fo rizzle, mah home g-dizzle tellizzle i'm in the shizzle, pretium the bizzle, mattizzle phat, eleifend fo shizzle mah nizzle fo rizzle, mah home g-dizzle, nunc. Fizzle suscipizzle. Nizzle pizzle sure sizzle purus. ",m("a.quote-by[onclick='$(\'#message-modal\').openModal();'][title='Send a private message']", "Anonymous")]),
					m("form", [
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
								m("button.btn.waves-effect.waves-light[name='action'][type='submit']", ["Comment",m("i.material-icons.right", "chat_bubble")])
							])
						])
					]),
					m(".comments-container", [
						m("blockquote", ["In shiznit leo fo shizzle mah nizzle fo rizzle, mah home g-dizzle break yo neck, yall. Da bomb shiz, nizzle non fo shizzle facilisizzle, sem fo shizzle my nizzle mofo sizzle, non dang felizzle a est. Suspendisse mah nizzle augue. Sed egestizzle lectus brizzle i saw beyonces tizzles and my pizzle went crizzle. Proin consectetuer things sapien. Etiam aliquet, dizzle sit amet accumsizzle tincidunt, fizzle sizzle sizzle sem, ac vestibulizzle fo shizzle mah nizzle fo rizzle, mah home g-dizzle nisi sit amizzle boom shackalack. Maecenizzle mah nizzle tortizzle vel enizzle. ",m("br"),m("span.quote-by", "G Dawg")]),
						m("blockquote", ["fo shizzle mah nizzle fo rizzle, mah home g-dizzle nisi sit amizzle boom shackalack. Maecenizzle mah nizzle tortizzle vel enizzle.",m("br"),m("span.quote-by", "H Dawg")])
					])
				]),
				m("li.message.hoverable.card-panel", [
					m("p.flow-tex", ["Lorizzle ipsizzle dawg sizzle fo shizzle, adipiscing crunk. Nullam sapien velizzle, volutpat, shizzlin dizzle quizzle, gravida vizzle, dang. Pellentesque eget tortor. Sed erizzle. Rizzle black shizznit pizzle fo shizzle my nizzle tempizzle doggy. Maurizzle bow wow wow fo cool the bizzle. Funky fresh in tortizzle. Pellentesque you son of a bizzle rhoncizzle nisi. Dope check out this boom shackalack gangsta gangsta. My shizz dapibus. Fo shizzle mah nizzle fo rizzle, mah home g-dizzle tellizzle i'm in the shizzle, pretium the bizzle, mattizzle phat, eleifend fo shizzle mah nizzle fo rizzle, mah home g-dizzle, nunc. Fizzle suscipizzle. Nizzle pizzle sure sizzle purus. Fo shizzle mah nizzle fo rizzle, mah home g-dizzle tellizzle i'm in the shizzle, pretium the bizzle, mattizzle phat, eleifend fo shizzle mah nizzle fo rizzle, mah home g-dizzle, nunc. Fizzle suscipizzle. Nizzle pizzle sure sizzle purus. ",m("span.quote-by", "Anonymous")])
				])
			]),
			"\n"
		]),"\n",m("footer.page-footer", [
			m(".footer-copyright", [
				m(".center-align.valign", "\n      © 2015 Nicholas Antonov & Brian Zawizawa for CS546 at Stevens\n    ")
			]),
			"\n"
		]),"\n\n",m(".login-box.z-depth-2[onclick='$(\'#combo-modal\').openModal();']", [
			m("a", "Log in / Register"),
			"\n"
		]),"\n\n",m(".modal[id='combo-modal']", [
			m(".modal-content", [
				m("p", "Thanks for using this site. To prevent abuse and allow for a rich featured experience, users are required to log in. Don't Worry! All your information will be kept anonymous as long as you choose to keep it that way.")
			]),
			m(".modal-footer", [
				m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left[onclick='$(\'#login-modal\').openModal();']", "Log In"),
				m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left[onclick='$(\'#register-modal\').openModal();']", "Register")
			]),
			"\n"
		]),"\n\n",m(".modal[id='login-modal']", [
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
							m("i.material-icons.prefix", "vpn_key"),
							m("input.validate[id='login-password'][type='password']"),
							m("label[for='login-password']", "Password")
						])
					])
				])
			]),
			m(".modal-footer", [
				m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right", "Log In")
			]),
			"\n"
		]),"\n\n",m(".modal[id='register-modal']", [
			m(".modal-content", [
				m("h4", "Register"),
				m("form.col.s12", [
					m(".row", [
						m(".input-field.col.s6", [
							m("i.material-icons.prefix", "account_circle"),
							m("input.validate[id='first_name'][required=''][type='text']"),
							m("label[for='first_name']", "First Name")
						]),
						m(".input-field.col.s6", [
							m("input.validate[id='last_name'][type='text']"),
							m("label[for='last_name']", "Last Name")
						])
					]),
					m(".row", [
						m(".input-field.col.s12", [
							m("i.material-icons.prefix", "vpn_key"),
							m("input.validate[id='password'][type='password']"),
							m("label[for='password']", "Password")
						])
					]),
					m(".row", [
						m(".input-field.col.s12", [
							m("i.material-icons.prefix", "vpn_key"),
							m("input.validate[id='confirm-password'][type='password']"),
							m("label[for='confirm-password']", "Confirm Password")
						])
					]),
					m(".row", [
						m(".input-field.col.s12", [
							m("i.material-icons.prefix", "email"),
							m("input.validate[id='email'][type='email']"),
							m("label[for='email']", "Email")
						])
					])
				])
			]),
			m(".modal-footer", [
				m("a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right", "Register")
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
		])]});
})
