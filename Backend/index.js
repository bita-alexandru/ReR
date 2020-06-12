const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { server } = require('./controllers/server');
const providers = require('./util/providers');

dotenv.config();

const host = process.env.HOST;
const port = process.env.PORT;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_name = process.env.DB_NAME;

mongoose.connect('mongodb+srv://' + db_user + ':' + db_pass + '@tw-rer-7opy7.mongodb.net/' + db_name + '?retryWrites=true&w=majority', {
    useUnifiedTopology: true, useNewUrlParser: true
});


server.listen(port, host, () => {
    console.log(`Listening at ${host}:${port}`);
});

 providers.gatherResources(60);