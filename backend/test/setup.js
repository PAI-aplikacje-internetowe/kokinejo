const chai = require('chai');
const chatHttp = require('chai-http');
const app = require('../app');

chai.use(chatHttp);

exports.mochaHooks = {
  beforeAll: (done) => {
    global.requester = chai.request(app).keepOpen();
    return done();
  },
  afterAll: (done) => {
    global.requester.close(done);
  },
};

global.makeid = (len) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  while (len-- > 0) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
