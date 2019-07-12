'use strict';

const mock = require('egg-mock');

let s = '';
for (let i = 0; i < 2019; i++) {
  s += 'x';
}

describe('test/framework.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'example',
      framework: true,
    });
    return app.ready();
  });

  after(() => app.close());

  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/?str=x')
      .set('Accept-Encoding', 'gzip')
      .expect(s)
      .expect(200);
  });
});

