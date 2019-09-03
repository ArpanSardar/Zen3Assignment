const fs = require('fs');

module.exports.converter = filePath => {
  try {
    var rawText = fs.readFileSync(filePath, 'utf-8');

    var textByLineArray = rawText.split('\r\n');
    var itemObj = {};
    textByLineArray.forEach(text => {
      var splitText = text.split('=');
      itemObj[splitText[0]] = splitText[1];
    });

    return itemObj;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};
