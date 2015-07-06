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

  console.log('updating posts with');
  console.log(data);

  m.request({
    method: "GET",
    url: 'api/post.php',
    data
  }).then((data) => {
    console.log('updated and recieved');
    console.log(data);
    posts(data)
  });
};

sortByNew();
