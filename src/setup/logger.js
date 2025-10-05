'use strict';

const pino = {
  info: console.log.bind(console, '[INFO]'),
  warn: console.warn.bind(console, '[WARN]'),
  error: console.error.bind(console, '[ERROR]'),
  debug: console.debug ? console.debug.bind(console, '[DEBUG]') : console.log.bind(console, '[DEBUG]'),
};

module.exports = { logger: pino };


