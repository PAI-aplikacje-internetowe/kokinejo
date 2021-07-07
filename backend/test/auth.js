const expect = require('chai').expect;

const app = () => global.requester; // this is set asynchronously by a hook

const prefix = '/auth';

// TODO: tests should be independent. Token usage here is not.

describe('Auth module', () => {
  describe('testing anonymous requests', () => {
    describe('GET', () => {
      [
        '/me',
        '/token',
      ].forEach((url) => {
        it(`should handle GET ${prefix}${url}`, (done) => {
          app()
            .get(prefix + url)
            .then((res) => {
              expect(res).to.have.status(401);
              done();
            })
            .catch(done);
        });
      });
    });

    describe('POST', () => {
      [
        '/me',
        '/token',
      ].forEach((url) => {
        it(`should handle POST ${prefix}${url}`, (done) => {
          app()
            .post(prefix + url)
            .then((res) => {
              expect(res).to.have.status(401);
              expect(res.status, 'status code').to.be.oneOf([400,401]);
              done();
            })
            .catch(done);
        });
      });
    });
  });

  describe(`${prefix}/signup`, () => {
    it('should handle no input', (done) => {
      app()
        .post(prefix + '/signup')
        .then((res) => {
          expect(res).to.have.status(400);
          done();
        })
        .catch(done);
    });
    it('should handle wrong input', (done) => {
      app()
        .post(prefix + '/signup')
        .send('user and password')
        .then((res) => {
          expect(res).to.have.status(400);
          done();
        })
        .catch(done);
    });
    it('should handle malformed json', (done) => {
      app()
        .post(prefix + '/signup')
        .set('Content-Type', 'application/json')
        .send('{"user')
        .then((res) => {
          expect(res).to.have.status(400);
          done();
        })
        .catch(done);
    });
  });

  describe('testing login', () => {
    const name = makeid(7);
    const password = makeid(12);
    let token = makeid(16);

    const get_token = (res) => {
      expect(res).to.be.json;
      expect(res).to.be.an('object');
      expect(res.text).to.be.a('string');
      const obj = JSON.parse(res.text);
      expect(obj.token).to.be.a('string');
      token = obj.token;
    };

    const check_token = () => {
      it('and returned token should work', (done) => {
        app()
          .get(prefix + '/me')
          .set('Authorization', 'Bearer ' + token)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            const json = JSON.parse(res.text);
            expect(json.name).to.be.equal(name);
            done();
          })
          .catch(done);
      });
    };

    describe(`using user: '${name}' with '${password}'`, () => {
      const gets = [
        '/me',
        '/token',
      ];

      gets.forEach((url) => {
        it(`should not be able to GET ${prefix}${url} using http basic auth`, (done) => {
          app()
            .get(prefix + url)
            .auth(name, password)
            .then((res) => {
              expect(res).to.have.status(401);
              done();
            })
            .catch(done);
        });
      });

      it(`should not be able to POST ${prefix}/token`, (done) => {
        app()
          .post(prefix + '/token')
          .send({ name, password })
          .then((res) => {
            expect(res).to.have.status(401);
            done();
          })
          .catch(done);
      });

      it('should reject wrong token', (done) => {
        app()
          .get(prefix + '/me')
          .set('Authorization', 'Bearer ' + token)
          .then((res) => {
            expect(res).to.have.status(401);
            done();
          })
          .catch(done);
      });

      it('should allow signing up', (done) => {
        app()
          .post(prefix + '/signup')
          .send({ name, password })
          .then((res) => {
            expect(res).to.have.status(200);
            get_token(res);
            done();
          })
          .catch(done);
      });

      check_token();

      gets.forEach((url) => {
        it(`should allow to GET ${prefix}${url} using http basic auth`, (done) => {
          app()
            .get(prefix + url)
            .auth(name, password)
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res).to.be.json;
              expect(res.text).to.be.a('string');
              if (url == '/token')
                get_token(res);
              done();
            })
            .catch(done);
        });

        if (url == '/token')
          check_token();
      });

      it(`should allow to POST ${prefix}/token`, (done) => {
        app()
          .post(prefix + '/token')
          .send({ name, password })
          .then((res) => {
            expect(res).to.have.status(200);
            get_token(res);
            done();
          })
          .catch(done);
      });

      check_token();

      it('should not allow geting token using token', (done) => {
        app()
          .get(prefix + '/token')
          .set('Authorization', 'Bearer ' + token)
          .then((res) => {
            expect(res).to.not.have.status(200);
            done();
          })
          .catch(done);
      });

    });
  });
});
