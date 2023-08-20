const express = require('express')
const app = express();

// ใช้งาน body-parser

app.use(express.static('www'))

app.listen(3000, () => {
    console.log(`http://localhost:3000`);
})

// 17 เรียกใช้ api
