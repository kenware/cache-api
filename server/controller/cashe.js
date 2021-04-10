
import mongoose from 'mongoose';
import Cashe from '../models/Cashe';
import MemCache from 'memory-cache';
import generateString from '../utils';
import config from '../config';

const CasheModel = mongoose.model('Cashe');


export default class CasheController {
  async createOrUpdate(req, res) {
    try {
      const { key } = req;
      const content = generateString(key)
      MemCache.put(key, content, config.TTL * 1000)

      const cacheExist = await CasheModel.findOne({key})
      if (!cacheExist) {
        await new CasheModel({ key, content}).save()
      }else {
        await CasheModel.updateOne({key}, { content }, { upsert: true });
      }
      return res.status(201).json(content);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async getOne(req, res) {
    try{
      const { key } = req.params;
      let content = MemCache.get(key)
      console.log(content)
      if (content) {
        console.log('Cache hit')
        // refresh TTL
        MemCache.put(key, content, config.TTL * 1000)
        return res.status(200).json(content);
      }else {
        console.log('Cache miss')
        content = generateString(key)
        const cacheExist = await CasheModel.findOne({key})

        if (cacheExist) { // posible if TTL has been exceeded
          await CasheModel.updateOne({key}, { content }, { upsert: true });
        }else {
          await new CasheModel({ key, content}).save()
        }

        MemCache.put(key, content, config.TTL * 1000)
        return res.status(400).json(content);
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
      return res.status(200).json(keys);
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
      await CasheModel.findOne({key}).remove().exec()
      return res.status(204).json();
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async deleteAll(req, res) {
    MemCache.clear()
    await CasheModel.remove({})
    return res.status(204).json();
  }

  }
