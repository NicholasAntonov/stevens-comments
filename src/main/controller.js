import m from 'mithril';

export default function () {
  let posts = m.request({
    method: "GET",
    url: 'post.php'
  });

  return {
    posts
  }
}
