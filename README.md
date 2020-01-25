# jQuery LightLayer Plugin

A simple responsive lightbox & dialog script.

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.svg)](http://gruntjs.com/) [![GitHub license](https://img.shields.io/badge/license-MIT-yellow.svg)](https://raw.githubusercontent.com/martinmethod/lightlayer/prod/LICENSE-MIT) [![Travis](https://img.shields.io/travis/martinmethod/lightlayer.svg)](https://travis-ci.org/martinmethod/lightlayer) [![David](https://img.shields.io/david/dev/martinmethod/lightlayer.svg)](https://david-dm.org/martinmethod/lightlayer?type=dev) [![GitHub release](https://img.shields.io/github/release/martinmethod/lightlayer.svg)](https://github.com/martinmethod/lightlayer/releases/latest) [![npm](https://img.shields.io/npm/v/lightlayer.svg)](https://www.npmjs.com/package/lightlayer) [![Bower](https://img.shields.io/bower/v/lightlayer.svg)](https://github.com/martinmethod/lightlayer)

## Description

jQuery LightLayer Plugin is a responsive lightbox & dialog script that fits well with any project on any screen. It provides great experience for users and it’s really quite simple to use. jQuery LightLayer Plugin gives control over many settings. Things like background color, background opacity, box position, open/close transitions and different abilities for closing are part of the options that users can manipulate by themselves. And no matter the content jQuery LightLayer Plugin will always have a proper behavior. It works fine with external websites, video players, maps. And if there is a long content jQuery LightLayer Plugin will use the native scrollbar without scrolling the page behind.

## Demo

<a href="https://lightlayer.metodiev.dev" target="_blank">lightlayer.metodiev.dev</a>

## Getting Started

You can [download the plugin as an archive][zip].

[zip]: https://github.com/martinmethod/lightlayer/zipball/prod

Or you can grab it by using **npm**:

```javascript
npm install lightlayer
```

Or you can grab it by using **Bower**:

```javascript
bower install lightlayer
```

## Installation

Include the script after the jQuery library (unless you package scripts otherwise):

```html
<script src="/path/to/lightlayer.min.js"></script>
```

Also include the stylesheet for the plugin:

```html
<link type="text/css" rel="stylesheet" href="/path/to/lightlayer.css">
```

## Usage

### I. Initialization

```javascript
$.lightlayer();
```

This is the most basic way to use jQuery LightLayer Plugin. By doing so the plugin will look for $('#popup') object, so if you're going to keep it simple, make sure you have that one in the DOM. If no such object, nothing will happen.

Of course, you can overwrite the default target by providing a custom one, so that you can use the jQuery LightLayer Plugin for more than one popup.

```javascript
$.lightlayer({
    object: $('#custom_popup')
});
```

Another way of calling LightLayer is right from a selector, as follows:

```javascript
$('.popup').lightlayer();
```
*If the selector returns more than one object, the first one will be used. Also, if the object doesn't have an ID, a system one will be given.*

### II. Options

```javascript
$.lightlayer({
    backgroundColor: '#000000',
    opacity: 0.3,
    transition: 0.1,
    position: 'middle',
    escape: true,
    cache: true
});
```

There are several properties for setting some features when initializing the LightLayer. Here's a list of them:

#### backgroundColor

Determines the background color of the layer behind the opened popup.

Type: **string**
Default value: **'#000000'**
Acceptable values: **only HEX colors, no matter with or without the # prefix**

#### opacity

Determines the opacity of the layer behind the opened popup.

Type: **number**
Default value: **0.3**
Acceptable values: **any number between 0 & 1 (incl.)**

#### transition

Determines the fade in/out transition speed (in seconds) of opening/closing the LightLayer. If set to 0, it will show & hide instantly.

Type: **number**
Default value: **0.1**

#### position

Determines the vertical position of the popup. 'Third' option will keep the popup in ⅓ from the top.

*The popups are always horizontally centered.*

Type: **string**
Default value: **'middle'**
Acceptable values: **'top', 'third', 'middle'**

#### escape

Determines if the popup should have the ability to be closed in a regular way or just in a specific one.

*If set to true, the user will be able to close the popup by clicking/tapping the X-button in the upper right corner and also outside of the popup, or by pressing Escape button from the keyboard (if on desktop).*

Type: **boolean**
Default value: **true**

#### cache

Determines if the selected popup should be cached for further calls of the same target or not.

Type: **boolean**
Default value: **true**

### III. Methods

When you have an opened LightLayer, there are several methods that allows manipulation of its environment.

So let's suggest there is an invoked LightLayer.

```javascript
$.lightlayer({
    object: $('#custom_popup'),
    opacity: 0.5,
    transition: 0,
    position: 'third'
});
```

After that initialization you are able to call the following methods:

#### backgroundColor()

Changes the background color of the layer behind the opened popup. For example:

```javascript
$.lightlayer().backgroundColor('FFFFFF');
```

#### opacity()

Changes the opacity of the layer behind the opened popup. For example:

```javascript
$.lightlayer().opacity(1);
```

#### position()

Changes the vertical position of the popup. For example:

```javascript
$.lightlayer().position('top');
```

#### escape()

Turns on/off the ability of a popup to be closed in a regular way or just in a specific one. For example:

```javascript
$.lightlayer().escape(false);
```

#### change()

Changes more than one option by passing an object with parameters. For example:

```javascript
$.lightlayer().change({
    backgroundColor: '#FFFFFF',
    opacity: 1,
    position: 'top',
    escape: false
});
```

#### exit()

Exits from LightLayer. For example:

```javascript
$.lightlayer().exit();
```

### IV. Callbacks

Besides the object and all options, there аre few callback functions that can be also passed to the LightLayer. Here's a list of them:

#### onOpen( e, popup )

Triggers right before showing a popup.

```javascript
$.lightlayer({
    onOpen: function( e, popup ) {
        // do something
    }
});
```

#### onClose( e, popup )

Triggers right after hiding a popup.

```javascript
$.lightlayer({
    onClose: function( e, popup ) {
        // do something
    }
});
```

#### onChangeBackgroundColor( e, data )

Triggers when changing the background color of the layer behind the opened popup.

```javascript
$.lightlayer({
    onChangeBackgroundColor: function( e, data ) {
        // do something
    }
});
```

#### onChangeOpacity( e, data )

Triggers when changing the opacity of the layer behind the opened popup.

```javascript
$.lightlayer({
    onChangeOpacity: function( e, data ) {
        // do something
    }
});
```

#### onChangePosition( e, data )

Triggers when changing the vertical position of the popup.

```javascript
$.lightlayer({
    onChangePosition: function( e, data ) {
        // do something
    }
});
```

#### onChangeEscape( e, data )

Triggers when changing the escape ability.

```javascript
$.lightlayer({
    onChangeEscape: function( e, data ) {
        // do something
    }
});
```

#### onChangeSettings( e, data )

Triggers when changing multiple settings.

```javascript
$.lightlayer({
    onChangeSettings: function( e, data ) {
        // do something
    }
});
```

## Browsers compatibility

- Apple Safari
- Google Chrome
- Microsoft Internet Explorer 9+
- Mozilla Firefox
- Opera

## Dependencies

- [jQuery][jq]

[jq]: https://github.com/jquery/jquery.git

## License

Copyright © 2017 Martin Metodiev. Licensed under the MIT license. [See here for more details.][licence]

[licence]: https://raw.github.com/martinmethod/lightlayer/prod/LICENSE-MIT
