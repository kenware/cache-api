
import mongoose from 'mongoose';
import Cashe from '../models/Cashe';
import MemCache from 'memory-cache';
import generateString from '../utils/utils';
import config from '../config';
import responseHandler from '../utils/responseHandler';
import Logger from 'logger-nodejs';
const log = new Logger();

const CasheModel = mongoose.model('Cashe');

/*
  CasheController
 */
export default class CasheController {
  async createOrUpdate(req, res) {
    try {
      const { key } = req;
      const content = generateString(key)
      MemCache.put(key, content, config.TTL * 1000)

      const cacheExist = await CasheModel.findOne({key})
      if (!cacheExist) {
        // Check for max cache entries
        // if the max cache entry is greater than the one set on config
        // delete the first entry added on the list of entries
        if (MemCache.memsize() > config.maxCacheEntry) {
          const keyToDelete = MemCache.keys()[0];
          MemCache.del(keyToDelete)
          await CasheModel.findOne({key: keyToDelete}).deleteOne().exec()
        }
        await new CasheModel({ key, content}).save()
        
      }else {
        await CasheModel.updateOne({key}, { content }, { upsert: true });
      }
      return responseHandler(res, content, 201)
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async getOne(req, res) {
    try{
      const { key } = req.params;
      let content = MemCache.get(key)
      if (content) {
        log.info('Cache hit')
        // refresh TTL
        MemCache.put(key, content, config.TTL * 1000)
        return responseHandler(res, content, 200);
      }else {
        log.info('Cache miss')
        content = generateString(key)
        const cacheExist = await CasheModel.findOne({key})

        if (cacheExist) { // posible if TTL has been exceeded
          await CasheModel.updateOne({key}, { content }, { upsert: true });
        }else {
          await new CasheModel({ key, content}).save()
        }

        MemCache.put(key, content, config.TTL * 1000)
        return responseHandler(res, content, 200);
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async getAll(req, res) {
    try{
      let keys = MemCache.keys()
      const count = await CasheModel.countDocuments({});
      if (keys.length !== count) {
        const data = await await CasheModel.find({}).select('key')
        data.forEach((item)=> {
          if (!keys.includes(item.key)) {
            MemCache.put(item.key, item.content, config.TTL * 1000)
            keys.push(item.key)
          }
        })
      }
      return responseHandler(res, keys, 200);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async deleteKey(req, res) {
    try{
      const { key } = req.params;
      const exist = MemCache.get(key)
      if (exist) {
        MemCache.del(key);
      }
      await CasheModel.findOne({key}).deleteOne().exec()
      return res.status(204).json();
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async deleteAll(req, res) {
    MemCache.clear()
    await CasheModel.deleteMany({})
    return res.status(204).json();
  }
  }
