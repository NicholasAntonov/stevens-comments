import m from 'mithril';
import * as main from './main';

$( document ).ready(() => {
  m.route(document.body, '/', {
    '/': main
  });
})
