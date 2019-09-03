const express = require('express');
const app = express();
const cors = require('cors');

//Enable Cors
app.use(cors());
//Init middleware to perse the body
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API is running'));

//Define routes
app.use('/api/valuefinder', require('./routes/api/valuefinder'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
