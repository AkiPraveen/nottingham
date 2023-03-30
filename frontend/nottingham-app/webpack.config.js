const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    new Dotenv({
      path: './.env', // Path to .env file (this is the default)
      debug: true,
      systemvars: true //  load system variables in a production environment
    })
  ]
};
