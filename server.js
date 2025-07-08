require('dotenv').config();

const config = require('./src/utils/config'); 
const app = require('./src/app');

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} (${config.env})`);
});
