# OpenLayers Street View

Street View implementation for Open Layers.

Tested with OpenLayers version 5 and 6. For Ol5, you must set a custom "target" to prevent the control from being rendered at the default target ("ol-overlaycontainer-stopevent"), because that messes up the events and breaks the control.

## Disclaminer

If you are going to use this module, read the Google [Terms of Service](https://www.google.com/help/terms_maps/)

## Examples

-   Basic usage: create an OpenLayers map instance, and pass that map and options to the Street View constructor.
    -   [Basic](https://raw.githack.com/GastonZalba/ol-street-view/v1.1.0/examples/basic.html)

## Install

### Browser

#### JS

Load `ol-street-view.js` after [OpenLayers](https://www.npmjs.com/package/ol) and [interactjs](https://www.npmjs.com/package/interactjs). StreetView is available as `StreetView`.

```HTML
<script src="https://unpkg.com/ol-street-view@1.1.0"></script>
```

#### CSS

```HTML
<link rel="stylesheet" href="https://unpkg.com/ol-street-view@1.1.0/dist/css/ol-street-view.min.css" />
```

### Parcel, Webpack, etc.

NPM package: [ol-street-view](https://www.npmjs.com/package/ol-street-view).

#### JS

Install the package via `npm`

    npm install ol-street-view --save-dev

#### CSS

The CSS files can be found in `./node_modules/ol-street-view/lib`

##### TypeScript type definition

TypeScript types are shipped with the project in the dist directory and should be automatically used in a TypeScript project. Interfaces are provided for Wfst Options.

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [StreetView](#streetview)
    -   [Parameters](#parameters)
    -   [showStreetView](#showstreetview)
    -   [hideStreetView](#hidestreetview)
-   [Options](#options)
    -   [apiKey](#apikey)
    -   [size](#size)
    -   [resizable](#resizable)
    -   [sizeToggler](#sizetoggler)
    -   [defaultMapSize](#defaultmapsize)
    -   [language](#language)

### StreetView

Street View implementation for Open Layers.

#### Parameters

-   `map` **[PluggableMap](https://openlayers.org/en/latest/apidoc/module-ol_PluggableMap-PluggableMap.html)** Instance of the created map
-   `opt_options` **[Options](#options)?** StreetView options, see [StreetView Options](#options) for more details.

#### showStreetView

Show Street View mode

Returns **void**

#### hideStreetView

Disables Street View mode

Returns **void**

###

For Ol5

### Options

**_[interface]_** - StreetView Options specified when creating an instance

Default values:

```javascript
{
  apiKey: null,
  size: 'lg',
  resizable: true,
  sizeToggler: true,
  defaultMapSize: 'expanded',
  language: 'en'
}
```

#### apiKey

Google Maps Api Key
If not provided, the map will be in inverted colors withe the message "For development purposes only"

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### size

Size of the Pegman Control in the map

Type: (`"sm"` \| `"md"` \| `"lg"`)

#### resizable

To display a handler that enable dragging changing the height of the layout

Type: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

#### sizeToggler

Control displayed once Street View is activated, to allow compact/expand the size of the map

Type: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

#### defaultMapSize

Default size of the map

Type: (`"expanded"` \| `"compact"`)

#### language

Language support

Type: (`"es"` \| `"en"`)

## Todo

-   Find the argument in the XYZ request that enables the Photo Spheres in the map
-   ~~Add resizable screen option~~
-   Add feedback support when element can't be dropped
-   Add extra layout (vertical)
-   ~~Add size toggler~~

## License

MIT (c) Gastón Zalba.
