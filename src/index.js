import m from 'mithril';
import main from './main-page';

$( document ).ready(() => {
  m.route(document.body, '/', {
    '/': main
  });
})
