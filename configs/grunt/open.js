var grunt = require('grunt');

module.exports = {
  dev : {
    app: 'Google Chrome',
    path: 'http://localhost:<%= config.port %>'
  },

  prod : {
    app: 'Google Chrome',
    path: '<%= pkg.homepage %>'
  },

  build: {
    app: 'Google Chrome',
    path: 'https://travis-ci.org/<%= config.githubUsername %>/<%= pkg.name %>/builds'
  },

  repo: {
    app: 'Google Chrome',
    path: 'https://github.com/<%= config.githubUsername %>/<%= pkg.name %>'
  }
};