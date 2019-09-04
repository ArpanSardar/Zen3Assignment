const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const keys = require('../../googleAPIConfig/googleSheetKeys.json');

const googleClient = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

//@route  POST api/accessgooglesheet/createGoogleSheet
//@desc   Create/Update data in google sheet
//@access public

router.post('/createGoogleSheet', async (req, res) => {
  try {
    googleClient.authorize(async (err, tokens) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Can not access google sheet');
        return;
      } else {
        console.log('Connected to google sheet');
        const gsapi = google.sheets({ version: 'v4', auth: googleClient });

        const options = {
          spreadsheetId: '1dCdEW8vnlC_jEGvYrNWBsXE_xvo4iBg6LNsBeBpzj1w',
          range: 'Sheet1!A1',
          valueInputOption: 'USER_ENTERED',
          resource: { values: req.body }
        };

        var response = await gsapi.spreadsheets.values.update(options);
        if (response.status === 200) {
          res.status(200).send('Data uploaded');
        } else {
          res.status(500).send('Could not upload data to google sheet');
        }
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
