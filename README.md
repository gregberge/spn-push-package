# spn-push-package
[![Build Status](https://travis-ci.org/hipush/spn-push-package.svg?branch=master)](https://travis-ci.org/hipush/spn-push-package)
[![Dependency Status](https://david-dm.org/hipush/spn-push-package.svg?theme=shields.io)](https://david-dm.org/hipush/spn-push-package)
[![devDependency Status](https://david-dm.org/hipush/spn-push-package/dev-status.svg?theme=shields.io)](https://david-dm.org/hipush/spn-push-package#info=devDependencies)

Generate a Safari Push Notifications package.

According to the [documentation of Apple](https://developer.apple.com/library/mac/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html#//apple_ref/doc/uid/TP40013225-CH3-SW7).

## Install

```
npm install spn-push-package
```

## Usage

```js
var path = require('path');
var spnPushPackage = require('spn-push-package');

var iconset = spnPushPackage.generateIconSet(fs.createReadStream('/my/icon/path.jpg'));

var zipStream = spnPushPackage.generate({
  websiteJSON: {
    websiteName: 'Hipush',
    websitePushId: 'web.net.hipush',
    allowedDomains: ['http://hipush.net'],
    urlFormatString: '%s',
    authenticationToken: '19f8d7a6e9fb8a7f6d9330dabe',
    webServiceURL: 'http://hipush.net/api/apple'
  },
  iconset: iconset
});

zipStream.pipe(fs.createWriteStream('/my/pushPackage.zip', {flags: 'w'}));
```

### spnPushPackage.generateIconSet(icon)

Generate an icon set from a readable stream. Return an map of stream corresponding to the iconset.

```js
var image = fs.createReadStream('/my/icon/path.jpg');
var iconset = spnPushPackage.generateIconSet(image);
```

### spnPushPackage.generateIcon(type)

Generate a specific icon.

```js
var image = fs.createReadStream('/my/icon/path.jpg');
var icon = spnPushPackage.generateIcon('icon_16x16@2x');
```

### spnPushPackage.generate(options)

Generate a push package.

**Options:**
```
@param {object} options Options
@param {object} options.websiteJSON WebsiteJSON entries
@param {object} options.iconset An object containing a map of stream.
```

**Returns:**
```
@returns {stream.Readable} zipStream
```

```js
var zipStream = spnPushPackage.generate({
  websiteJSON: {
    websiteName: 'Hipush',
    websitePushId: 'web.net.hipush',
    allowedDomains: ['http://hipush.net'],
    urlFormatString: '%s',
    authenticationToken: '19f8d7a6e9fb8a7f6d9330dabe',
    webServiceURL: 'http://hipush.net/api/apple'
  },
  iconset: iconset
});
```

## License

MIT
