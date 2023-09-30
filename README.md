# OpenLayers Street View

<p align="center">
    <a href="https://www.npmjs.com/package/ol-street-view">
        <img src="https://img.shields.io/npm/v/ol-street-view.svg" alt="npm version">
    </a>
    <a href="https://img.shields.io/npm/dm/ol-street-view">
        <img alt="npm" src="https://img.shields.io/npm/dm/ol-street-view">
    </a>
    <a href="https://github.com/gastonzalba/ol-street-view/blob/master/LICENSE">
        <img src="https://img.shields.io/npm/l/ol-street-view.svg" alt="license">
    </a>
</p>

Street View implementation for Open Layers.

Tested with OpenLayers version 5, 6 and 7. For Ol5, you must set a custom "target" to prevent the control from being rendered at the default target ("ol-overlaycontainer-stopevent"), because that messes up the events and breaks the control.

## Disclaimer

If you are going to use this module, read the Google [Terms of Service](https://www.google.com/help/terms_maps/).

## Examples

-   Basic usage: create an OpenLayers map instance, and pass that map and options to the Street View constructor.
    -   [Basic](https://raw.githack.com/GastonZalba/ol-street-view/v2.2.2/examples/basic.html)

## Usage

```js
// Default options
const opt_options = {
    /**
     * Official Google Maps Api Key
     * If not provided, the map will be in inverted colors with the message "For development purposes only"
     */
    apiKey: null,

    /**
     * Size of the Pegman Control in the map
     */
    size: 'lg',

    /**
     * Maximum distance (in meters) that Street View can traslate to show the closest panorama
     */
    radius: 100;

    /**
     * If true, Pegman will traslate to the new location based on the maximum radius provided
     */
    updatePegmanToClosestPanorama: true;

    /**
     * Hides the container button that holds Pegman
     */
    transparentButton: false;

    /**
     * Zoom level on the map when init the Panorama
     */
    zoomOnInit: 18, 

    /**
     * Minimum zoom level to show the Pegman control
     */
    minZoom: null,

    /**
     * To display a handler that enable dragging changing the height of the layout
     */
    resizable: true,

    /**
     * Control displayed once Street View is activated, to allow compact/expand the size of the map
     */
    sizeToggler: true,
    
    /**
     * Default size of the map when the Street View is activated
     */
    defaultMapSize: 'expanded',

    /**
     * To configure if the Google Maps Library should be called automatically.
     * `false` if you are going to load it on your own. If so, you must run the `init` method AFTER the library is loaded. In this case the event 'loadLib' will not be fired.
     */
    autoLoadGoogleMaps: true,

    /**
     * Specify a target if you want the control to be rendered outside of the map's viewport.
     * For Ol5, you must set a target to prevent the control from being rendered at the default
     * target ("ol-overlaycontainer-stopevent"), otherwise the control will not work.
     */
    target: 'map',

    /**
     * Language support
     */
    language: 'en',

    /**
     * Add custom translations
     * Default is according to selected language
     */
    i18n: {...},
}

const streetView = new StreetView(opt_options);

map.addControl(streetView); // or streetView.setMap(map);

```

### Methods
```js
/**
 * ONLY use this method if `autoLoadGoogleMaps` is `false`. Call it after the Google Maps library is loaded.
 * Otherwise it will called automatically after the Maps Library is loaded.
 * @returns
 */
streetView.init()

/**
 * This is useful if wou wanna add a custom icon on the panorama instance,
 * add custom listeners, etc
 * @returns {google.maps.StreetViewPanorama}
 */
const googleStreetViewPanorama = streetView.getStreetViewPanorama();

/**
 * Get the Vector Layer in wich Pegman is displayed
 * @returns {VectorLayer<VectorSource>}
 */
const vectorLayer = streetView.getPegmanLayer();

/**
 * Get the background Raster layer that displays the existing zones with Street View available
 * @returns {TileLayer<XYZ>}
 */
const rasterLlayer = streetView.getStreetViewLayer();

/**
 * Show Street View mode
 * @fires streetViewInit
 * @param {Coordinate} coords Must be in the map projection format
 * @returns {google.maps.StreetViewPanorama}
 */
const googleStreetViewPanorama = streetView.showStreetView(coords);

/**
 * Hide Street View, remove layers and clear features
 * @fires streetViewExit
 * @returns
 */
streetView.hideStreetView();

/**
 * Remove the control from its current map and attach it to the new map. 
 * Pass null to just remove the control from the current map. 
 * @param map
 * @returns
 */
streetView.setMap(null);

```

### Events
```js
streetView.once(`loadLib`, () => console.log('Fired once after the Google library is loaded'))
streetView.on(`streetViewInit`, () => console.log('Fired everytime Street View mode is activated'))
streetView.on(`streetViewExit`, () => console.log('Fired everytime after is exited'))
```

## Install

### Browser

#### JS

Load `ol-street-view.js` after [OpenLayers](https://www.npmjs.com/package/ol) and [interactjs](https://www.npmjs.com/package/interactjs). StreetView is available as `StreetView`.

```HTML
<script src="https://unpkg.com/ol-street-view@2.2.2"></script>
```

#### CSS

```HTML
<link rel="stylesheet" href="https://unpkg.com/ol-street-view@2.2.2/dist/css/ol-street-view.min.css" />
```

### Parcel, Webpack, etc.

NPM package: [ol-street-view](https://www.npmjs.com/package/ol-street-view).

Install the package via `npm`

    npm install ol-street-view

#### JS

```js
import StreetView, { Options, i18n, SVEventTypes, Language, BtnControlSize, MapSize } from 'ol-street-view';
```

#### CSS

```js
import 'ol-street-view/lib/style/css/ol-street-view.css';
//or
import 'ol-street-view/lib/style/scss/ol-street-view.scss';
```

##### TypeScript type definition

TypeScript types are shipped with the project in the dist directory and should be automatically used in a TypeScript project. Interfaces are provided for the Options.

## Todo

-   Find the argument in the XYZ request that enables the Photo Spheres in the map
-   ~~Add resizable screen option~~
-   Add feedback support when element can't be dropped
-   Add extra layout (vertical)
-   ~~Add scss~~
-   ~~Add size toggler~~
-   ~~Improve scss style (add some variables)~~
