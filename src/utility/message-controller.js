import m from 'mithril';

export const posts = m.prop([]);

export const sortingByTop = m.prop(false);

export function sortByNew () {
  sortingByTop(false);
  updatePosts();
};

export function sortByTop () {
  sortingByTop(true);
  updatePosts();
};

export function updatePosts() {
  let data = {
    comments: 10
  };

  if (sortingByTop()) {
    data.top = true;
  }

  m.request({
    method: "GET",
    url: 'api/post.php',
    data
  }).then(posts);
};

sortByNew();
