const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users.routes');
const cors = require('cors');
const sequelize = require('./DBInit/DB.init');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/users', usersRouter);

app.listen(3000, () => {
    console.log('Server started at port:3000')
})
// sequelize.sync()
