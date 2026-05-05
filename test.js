const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/teste')
  .then(() => {
    console.log('CONECTOU NO MONGO ✅');
    process.exit();
  })
  .catch(err => {
    console.log('ERRO ❌');
    console.log(err);
    process.exit();
  });