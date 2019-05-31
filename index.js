const qs = require('qs');
const pick = require('lodash.pick');

module.exports = function parseListOpts(querystring, defaults) {
  const query = pick(qs.parse(querystring), ['limit', 'offset', 'order', 'where']);

  const opts = {
    limit: 20,
    offset: 0,

    order: [], // query ex: `order=id&order=-name`
    where: {}, // query ex: `where[name]=doug&where[color]=red`

    ...defaults,
    ...query
  };

  const { limit, offset, where } = opts;

  if (!Array.isArray(opts.order)) opts.order = [opts.order];

  const order = opts.order.map(field => {
    const orderPart = field.split('-').reverse();
    if (typeof orderPart[1] === 'string') orderPart[1] = 'DESC';
    return orderPart;
  });

  return { limit, offset, order, where };
};

