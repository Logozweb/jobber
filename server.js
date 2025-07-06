const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Optional: Simple API key check for security
const API_KEY = 'YOUR_SECRET_API_KEY'; // Change this to a strong random string

app.post('/api/add-job', async (req, res) => {
  // Security: check API key in header
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const job = req.body;
  try {
    await db.collection('jobs').add({
      ...job,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));