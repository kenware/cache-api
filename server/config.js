require('dotenv').config();

const TTL = process.env.TTL || 200;
const mongoConnectionString = process.env.MONGO_URL;
const maxCacheEntry = process.env.MAX_CACHE_ENTRY || 10;

export default {
    TTL,
    mongoConnectionString,
    maxCacheEntry
}
