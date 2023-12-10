const express = require('express');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;
  if(!name || !email || !message){
     res.send('Missing fields');
     return
  }

  const region = 'us-east-1'; // Specify your desired region here

  const snsClient = new SNSClient({ region });

  const params = {
    Message: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
    TopicArn: 'arn:aws:sns:us-east-1:417949585176:comath',
  };

  try {
    const command = new PublishCommand(params);
    const response = await snsClient.send(command);
    console.log('Message sent:', response.MessageId);
    res.send('Email sent successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending email');
  }
});

module.exports = router;