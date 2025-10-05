'use strict';

const mongoose = require('mongoose');
const { logger } = require('./logger');
const { performance } = require('perf_hooks');
require('dotenv').config();

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI || "mongodb+srv://cbm360tiv:MiiFze4xYGr6XNji@cluster0.sf6iagh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster";
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 15000,
    // Prefer DB name from the URI; avoid separate dbName to prevent mismatches
    dbName: undefined,
  });

  isConnected = true;
  const usedDb = (mongoose.connection && mongoose.connection.name) || 'unknown';
  logger.info(`Connected to MongoDB (db: ${usedDb})`);

  // Global Mongoose query timing plugin
  const timingPlugin = function(schema) {
    schema.pre(/^find|count|aggregate|update|save/, function(next) {
      this.__startTime = performance.now();
      next();
    });
    schema.post(/^find|count|aggregate|update|save/, function(result, next) {
      if (this && this.__startTime) {
        const durationMs = (performance.now() - this.__startTime).toFixed(2);
        const modelName = this.model && this.model.modelName ? this.model.modelName : (this.constructor && this.constructor.modelName) || 'UnknownModel';
        const op = this.op || (this.constructor && this.constructor.name) || 'op';
        // eslint-disable-next-line no-console
        console.log(`MongoDB ${modelName}.${op} took ${durationMs} ms`);
      }
      next();
    });
  };
  mongoose.plugin(timingPlugin);
}

module.exports = { connectToDatabase };


