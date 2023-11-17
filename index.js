const express = require('express');
const ejs  = require('ejs')
const app = express();
const port = 3000;

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// AWS SES configuration
const AWS = require('aws-sdk');
AWS.config.update({
    "region": "",
	"accessKeyId": "",
	"secretAccessKey": ""
  });
  
  // Create the SES service object
  const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// Render EJS template and send email via SES
app.get('/sendEmail', async (req, res) => {
    try {
        const params = {
            Destination: {
                ToAddresses: ['kunal.kumar@shipsy.io'] // Replace with recipient's email
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: await ejs.renderFile('views/test.ejs',  {
                            "headerImageUrl": "https://shipsy-public-assets.s3-us-west-2.amazonaws.com/shipper-dashboard/mailers/bid_rejected.png",
                            "freightCharges": 123,
                            "originCharges": "$123",
                            "destinationCharges": 1234,
                            "shipperName": "Reliance",
                            "referenceNumber": "SEHR62728",
                            "POL": "POSTU",
                            "POD": "TIKIO",
                            "viewBidsDetailLink": "test",
                            "Unsubscribe": "test"
                        })
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Subject of the Email'
                }
            },
            Source: 'support@shipsy.io' // Replace with sender's email
        };

        const sendEmailResponse = await ses.sendEmail(params).promise();
        console.log('Email sent:', sendEmailResponse);
        res.send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});