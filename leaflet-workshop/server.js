const express = require('express')
const app = express();

// ใช้งาน body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('www'))

app.listen(3000, () => {
    console.log(`http://localhost:3000`);
})

// 17 เรียกใช้ api
const api = require('./service/api');
app.use(api);