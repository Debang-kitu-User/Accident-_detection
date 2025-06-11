const express = require('express');
const router = express.Router();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

router.post('/', async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to
    });

    console.log('SMS Sent:', response.sid);
    res.status(200).json({ success: true, sid: response.sid });
  } catch (error) {
    console.error('SMS Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
