import errorHandler from '../utils/errorHandler';

export default class CacheMiddleware {
    // eslint-disable-next-line consistent-return
    validateCreateUpdate(req, res, next) {
        let { key } = req.body; //create new for post data

        if (!key) {
          key = req.params.key; // for update existing key
        }

        if (!key) errorHandler(res, 'key field is required', 400);

        req.key = key;
      
        next();
    }

    validateOne(req, res, next) {
      let { key } = req.params;

      if (!key) return errorHandler(res, 'key field is required', 400);
    
      next();
  }

}