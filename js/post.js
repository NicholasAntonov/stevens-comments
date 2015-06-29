
Post = {}

Post.model = function() {

}

//make a higher level
Post.controller = function() {
    var ctrl = this
    ctrl.posts = m.request({method: "GET", url: "/stevens-comments/php/post.php"})
    m.route.mode = "hash";
    m.route(document.body, "/login", {
        "/login": Login,
        "/:default": Post
    });
}

Post.view = function(ctrl) {
    return m('.posts', [
        ctrl.posts().map(function (post, idx) {
            return m('section', [
                m('h1', post["name"]),
                m('h2', post["date"]),
                m('p', post["post"]),
                m('p', post["votes"]),
                m('p', post["u_id"]), //if u_id isn't -1, then it is the current user's post. Add a delete button
                m('p', post["value"]), //if value exists, then the user already voted
                m.component(Comment, { p_id : post["p_id"]}),
                m('hr')
            ])
        })
    ])
}
