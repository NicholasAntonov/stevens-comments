import m from 'mithril';

export default function (prop) {
  return {onchange: m.withAttr("value", prop), value: prop()};
}
