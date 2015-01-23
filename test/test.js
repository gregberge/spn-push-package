var expect = require('chai').expect;
var spn = require('../');
var path = require('path');
var fs = require('fs');
var Promise = require('promise');

var yodaPath = path.join(__dirname, 'mocks/yoda.jpg');

describe('Spn push package', function () {
  describe('#generateIcon', function () {
    var expected30x30, expected30x30at2x;

    before(function () {
      expected30x30 = fs.readFileSync(path.join(__dirname, 'mocks/yoda-30x30.png'), 'binary');
      expected30x30at2x = fs.readFileSync(path.join(__dirname, 'mocks/yoda-30x30@2x.png'), 'binary');
    });

    it('should generate an icon with simple format', function () {
      var stream = spn.generateIcon(yodaPath, '30x30');
      return streamToString(stream)
      .then(function (str) {
        expect(str).to.equal(expected30x30);
      });
    });

    it('should generate an icon with multiplicator format', function () {
      var stream = spn.generateIcon(yodaPath, '30x30@2x');
      return streamToString(stream)
      .then(function (str) {
        expect(str).to.equal(expected30x30at2x);
      });
    });

    // it.only('should generate a big image', function (done) {
    //   var stream = spn.generateIcon(yodaPath, '128x128@2x');
    //   var writeStream = fs.createWriteStream(path.join(__dirname, 'tmp/big.png'));
    //   stream.pipe(writeStream);
    //   writeStream.on('close', done);
    // });
  });

  describe('#generateIconSet', function () {
    it('should generate an icon set', function () {
      var iconset = spn.generateIconSet(yodaPath);
      expect(iconset).to.have.property('icon_16x16.png');
      expect(iconset).to.have.property('icon_16x16@2x.png');
      expect(iconset).to.have.property('icon_32x32.png');
      expect(iconset).to.have.property('icon_32x32@2x.png');
      expect(iconset).to.have.property('icon_128x128.png');
      expect(iconset).to.have.property('icon_128x128@2x.png');
    });
  });

  describe.only('#generate', function () {
    it('should generate a package', function (done) {
      var zipPath = path.join(__dirname, 'tmp/test.zip');
      var iconset = spn.generateIconSet(yodaPath);
      var zipStream = spn.generate({
        websiteJSON: {
          websiteName: 'Hipush',
          websitePushId: 'web.net.hipush',
          allowedDomains: ['http://hipush.net'],
          urlFormatString: '%s',
          authenticationToken: '19f8d7a6e9fb8a7f6d9330dabe',
          webServiceURL: 'http://hipush.net/api/apple'
        },
        iconset: iconset,
        key: path.join(__dirname, 'mocks/key.pem'),
        cert: path.join(__dirname, 'mocks/certificate.pem')
      });

      var writeStream = fs.createWriteStream(zipPath);
      zipStream.pipe(writeStream);

      writeStream.on('close', function () {
        var stats = fs.statSync(zipPath);
        expect(stats.size).to.be.at.least(153000);
        expect(stats.size).to.be.at.most(153100);
        done();
      });
    });
  });
});

/**
 * Convert a stream to a string.
 *
 * @param {stream.Readable} stream Stream
 * @returns {Promise}
 */

function streamToString(stream) {
  return new Promise(function (resolve, reject) {
    var str = '';

    stream.on('data', function (b) {
      str += b.toString('binary');
    });

    stream.on('error', reject);

    stream.on('end', function () {
      resolve(str);
    });
  });
}
