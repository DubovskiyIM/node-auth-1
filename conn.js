const mongoose = require('mongoose');

mongoose.set('debug', true);

const getConn = async () => {
  await mongoose.connect('mongodb://reader:123321@kodaktor.ru/readusers', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

getConn().catch(e => console.error(e))

module.exports = mongoose;
