
Posts = {}

Posts.model = function() {

}

Posts.controller = function() {
    var ctrl = this
    ctrl.posts = m.request({method: "GET", url: "/stevens-comments/php/post.php"})
    //for each post, make a request for its comments and add it on
}

Posts.view = function(ctrl) {
    return m('.posts', [
        ctrl.posts().map(function (post, idx) {
            return m('section', [
                m('h1', post["name"]),
                m('h2', post["date"]),
                m('p', post["post"]),
                m('p', post["votes"]),
                m('p', post["u_id"]), //if u_id isn't -1, then it is the current user's post. Add a delete button
                m('p', post["value"]) //if value exists, then the user already voted
            ])
        })
    ])
}

function login() {
    m.request({method: "POST", url: "/stevens-comments/php/login.php", data: {username: "brian", password: "test"}})
}