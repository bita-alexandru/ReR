const { server } = require('./controllers/server');
const dotenv = require('dotenv');

dotenv.config();

const host = process.env.HOST;
const port = process.env.PORT;

server.listen(port, host, () => {
    console.log(`Listening at ${host}:${port}`);
});