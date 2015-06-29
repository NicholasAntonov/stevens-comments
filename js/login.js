
Login = {}

Login.model = function() {
    this.username = m.prop('username')
    this.password = m.prop('password')
}

Login.controller = function() {
    var ctrl = this
    ctrl.info = m.prop(new Login.model())

    ctrl.login = function() {
        ctrl.test = m.request({method: "GET", url: "/stevens-comments/php/login.php", data: {username: ctrl.info().username(), password: ctrl.info().password()}})
    }

}

Login.view = function(ctrl) {
    return m('.login', [
            m('form', [
                m('label', "username: "),
                m('input[type=text]', {value: ctrl.info().username(), placeholder : "username", onchange: m.withAttr('value', ctrl.info().username)}),
                m('label', "password: "),
                m('input[type=password]', {value: ctrl.info().password(), placeholder : "password", onchange: m.withAttr('value', ctrl.info().password)}),
                m('button', { onclick: ctrl.login }, 'Login')
            ])
    ])
}

