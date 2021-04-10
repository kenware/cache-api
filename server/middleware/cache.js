export default class CacheMiddleware {
    // eslint-disable-next-line consistent-return
    validateCreateUpdate(req, res, next) {
        let { key } = req.body; //create new for post data

        if (!key) {
          key = req.params.key; // for update existing key
        }

        if (!key) return res.status(400).json('key field is required')

        req.key = key;
      
        next();
    }

    validateOne(req, res, next) {
      let { key } = req.params;

      if (!key) return res.status(400).json('key field is required');
    
      next();
  }

}