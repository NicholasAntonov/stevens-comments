
Comment = {}

Comment.model = function() {

}

Comment.controller = function(options) {
    var ctrl = this
    ctrl.comments = m.request({method: "GET", url: "/stevens-comments/php/comment.php", data: { p_id: options.p_id }})
}

Comment.view = function(ctrl) {
    return m('.comment', [
        ctrl.comments().map(function (comment, idx) {
            return m('p', [
                m('h1', comment["name"]),
                m('h2', comment["date"]),
                m('p', comment["comment"]),
                m('p', comment["votes"]),
                m('p', comment["u_id"]), //if u_id isn't -1, then it is the current user's comment. Add a delete button
                m('p', comment["value"]) //if value exists, then the user already voted
            ])
        })
    ])
}
