const qs = require('qs');
const pick = require('lodash.pick');

module.exports = function parseListOpts(
  querystring,
  defaults,
  opts = { format: 'knex', pageBase: 0 }
) {
  if (opts.format && !/(sequelize|knex)/.test(opts.format)) console.warn('unsupported format');

  const baseQuery = qs.parse(querystring);
  const parsedQuery = pick(baseQuery, ['page', 'limit', 'offset', 'order', 'where']);

  // query ex: `order=id&order=-name`
  // query ex: `where[name]=doug&where[color]=red`

  const query = {
    page: opts.pageBase || 0,
    limit: 20,
    offset: 0,

    order: [],
    where: {},

    ...defaults,
    ...parsedQuery
  };

  let { page, limit, offset, where } = query;

  page = parseInt(page);
  limit = parseInt(limit);
  offset = parseInt(offset);

  if (!Array.isArray(query.order)) query.order = [query.order];

  const order = query.order.map(field => {
    let [column, order] = field.split('-').reverse();
    order = typeof order === 'string' ? 'desc' : 'asc';
    return opts.format === 'knex' ? { column, order } : [column, order];
  });

  return { ...baseQuery, page, limit, offset, order, where };
};
