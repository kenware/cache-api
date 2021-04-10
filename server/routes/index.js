import express from 'express';
import CasheController from '../controller/cashe';
import CacheMiddleware from '../middleware/cache';

const router = express.Router();
const Cashe = new CasheController();
const Middleware = new CacheMiddleware()

// add a key and a random content
router.post(
    '/cache/add',
    Middleware.validateCreateUpdate,
    Cashe.createOrUpdate
);
// return all keys
router.get(
    '/cache/keys',
    Cashe.getAll
);
// return the content of a key
router.get(
    '/cache/:key',
    Cashe.getOne
);

// update the content of a key or generate a new content for that key
router.put(
    '/cache/:key',
    Middleware.validateCreateUpdate,
    Cashe.createOrUpdate
);

// delete a key in the cache
router.delete(
    '/cache/:key',
    Middleware.validateOne,
    Cashe.deleteKey
);

// delete all key in the cache
router.delete(
    '/cache/keys',
    Cashe.deleteAll
);

export default router;