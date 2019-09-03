const express = require('express');
const router = express.Router();
const textToObjectConverter = require('../../utils/textToObjectConverter');
const { check, validationResult } = require('express-validator');
const fs = require('fs');

//@route  GET api/valuefinder/getEnvironment/:process
//@desc   It takes request params as process name and return the JSON key-value of the requested process.
//@access public

router.get('/getEnvironment/:process', (req, res) => {
  // const filePath = `./environmentFiles/${req.params.process}.env`;
  // const filePath = `D://EnvironmentFiles//${req.params.process}.env`;

  var mapObject = textToObjectConverter.converter('./environmentFiles/map.env');
  if (Object.keys(mapObject).includes(req.params.process)) {
    const filePath = mapObject[req.params.process];
    fs.access(filePath, fs.F_OK, err => {
      if (err)
        res.status(500).send(`${req.params.process} : No such process exist.`);

      try {
        var itemObj = textToObjectConverter.converter(filePath);
        res.json(itemObj);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    });
  } else {
    res.status(500).send(`${req.params.process} : No such process exist.`);
  }
});

//@route  POST api/valuefinder/setEnvironment/:process/:key/:value
//@desc   It takes request params as process name,key and value then update the env file and return the              updated JSON key-value of the requested process.
//@access public

router.post('/setEnvironment/:process/:key/:value', (req, res) => {
  // const filePath = `D://EnvironmentFiles//${req.params.process}.env`;

  var mapObject = textToObjectConverter.converter('./environmentFiles/map.env');
  if (Object.keys(mapObject).includes(req.params.process)) {
    const filePath = mapObject[req.params.process];
    fs.access(filePath, fs.F_OK, err => {
      if (err) {
        res.status(500).send(`${req.params.process} : No such process exist.`);
      } else {
        try {
          var rawText = fs.readFileSync(filePath, 'utf-8');
          if (!rawText.includes(req.params.key)) {
            res
              .status(500)
              .send(
                `In ${req.params.process} there is no such key called ${req.params.key}.`
              );
          } else {
            var itemObj = textToObjectConverter.converter(filePath);

            itemObj[req.params.key] = req.params.value;
            var modifiedValues = '';
            for (let [key, value] of Object.entries(itemObj)) {
              modifiedValues = modifiedValues + `${key}=${value}\r\n`;
            }
            fs.writeFile(
              filePath,
              modifiedValues.slice(0, -2), // To eliminate the last carriage return from string
              'utf8',
              err => {
                if (err) {
                  console.log(err);
                  res
                    .status(500)
                    .send('Error! Could not update the process file');
                } else {
                  return res.json(itemObj);
                }
              }
            );
          }
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
        }
      }
    });
  } else {
    //We can add new map entry here but in that case user sould be restricted to create unlimited process entry from client side. Otherwise we can do seperate route for creation.

    res.status(500).send(`${req.params.process} : No such process exist.`);
  }
});

module.exports = router;
