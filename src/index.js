import m from 'mithril';

import main from './main-page';
import messages from './messages';

$( document ).ready(() => {
  m.route(document.body, '/', {
    '/': main,
    '/messages': messages
  });
})
