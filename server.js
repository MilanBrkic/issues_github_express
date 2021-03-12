const express = require('express')
const app = express()
const port = 3000
const router = require('./routes/routes');




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('./uploads/', express.static('uploads'));
app.use('/api/issues', router);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;