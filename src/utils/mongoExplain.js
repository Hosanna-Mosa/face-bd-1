'use strict';

const mongoose = require('mongoose');

/**
 * Run explain("executionStats") for a given Mongoose query function.
 * Usage example:
 *   const stats = await explainExecution(() => Page.find({ slug: 'testing' }));
 */
async function explainExecution(queryFactory) {
  if (typeof queryFactory !== 'function') {
    throw new Error('queryFactory must be a function returning a Mongoose Query');
  }
  const q = queryFactory();
  if (!q || typeof q.explain !== 'function') {
    throw new Error('queryFactory must return a Mongoose Query supporting explain');
  }
  // @ts-ignore: Mongoose Query has .explain but types may vary
  const result = await q.explain('executionStats');
  return result;
}

module.exports = { explainExecution };



