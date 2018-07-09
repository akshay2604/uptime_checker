var env = {}

// Staging default environment

env.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName ': 'staging'
}

env.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production'
}

// Determine which env we pass from command line;
var currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';


var environmentToExport = typeof(env[currentEnv] == 'object')? env[currentEnv]: env.staging

module.exports = environmentToExport;


