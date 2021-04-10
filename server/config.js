
const TTL = process.env.TTL || 200;
const mongoConnectionString = process.env.MONGO_URL || 'mongodb+srv://kenware:dehydrogenase@cluster0.zmg5m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

export default {
    TTL,
    mongoConnectionString
}
