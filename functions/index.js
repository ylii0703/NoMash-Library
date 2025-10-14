
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { logger } = require('firebase-functions'); // v2 的 logger 也兼容这样 require
const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');

initializeApp();

exports.countBooks = onRequest({ cors: true }, async (req, res) => {
  try {
    const snapshot = await getFirestore().collection('books').get();
    res.status(200).json({ count: snapshot.size });
  } catch (err) {
    logger.error('Error counting books:', err);
    res.status(500).json({ error: 'Failed to count books' });
  }
});

exports.capitalizeBookData = onDocumentCreated('books/{bookId}', async (event) => {
  const snap = event.data;
  if (!snap) return;

  const data = snap.data();
  const updated = {};
  for (const [k, v] of Object.entries(data)) {
    updated[k] = typeof v === 'string' ? v.toUpperCase() : v;
  }
  await snap.ref.update(updated);
  logger.info(`Capitalized: ${snap.ref.path}`);
});

exports.getAllBooks = onRequest({ cors: true, region: 'us-central1' }, async (req, res) => {
  try {
    const snap = await getFirestore().collection('books').get();
    const books = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.status(200).json({ count: books.length, books });
  } catch (err) {
    logger.error('Error getting all books:', err);
    res.status(500).json({ error: 'Failed to get all books' });
  }
});