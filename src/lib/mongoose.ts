import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error('Missing MONGODB_URI in environment');
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const cached = globalThis._mongoose || { conn: null, promise: null };

globalThis._mongoose = cached;

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;
