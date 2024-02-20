# Changelog

## v1.0.0
* Module created

## v1.0.1
* Corrected Google XYZ url to use multiples servers {0-3}
* Added scroller to resize the layout
* Renamed some ids and classes
* Fixed some css on small devices

## v1.0.2
* Fixed resize action on touch devices

## v1.0.3
* Changed panorama background color
* Added icon when no results are found
* Some CSS improvement
* More precise coordinates on drop

## v1.0.4
* Fixed handler visibility

## v1.0.5
* Added Control size toggler to show in compact mode
* Changed Street View map style (to cyan)
* Added min-height restriction to the map when Street View is active and resizable is enabled

## v1.0.6
* Better anchor point position in Pegman Feature
* Added defaultMapSize option
* Added CSS transitions on resize
* Added debounce refreh while resizing layout

## v1.0.7
* Updated example CDN
* Fixed bug when dragging pegman on Ol5

## v1.0.8
* Improved compensation of the viewport top and left offsets, when it's not 100% width and/or height

## v1.0.9
* Fixed minor css

## v1.1.0
* Added customizable "target". If necessary, the control can be rendered outside the map. This allows a customizable workaround for Ol5, because the default target ("ol-overlaycontainer-stopevent") messes up the events in the control.

## v1.1.2
* Added Option property 'i18n' to allow custom translations
* Fixed some properties in interface Options (required to optional)

## v1.1.3
* Improved README
* Removed some peerDependencies

## v1.1.4
* Moved some devDependencies to dependencies
* `npm audit fix`

## v1.1.5
* Improved typescript and rollup configuration
* Added "watch" script
* Updated dependencies
* Added Source Maps

## v1.1.7
* Updated dependencies
* Fixed resizable scrollbar (css)
* Added .gitattributes
* Fixed example link on README

## v2.0.0
* Refactored code: class extends class ol.control.Control (breaking changes)
* Added method `getStreetViewPanorama` to allow get the Google Maps Panorama instance
* Added/fixed method `showStreetView` to initialize panorama mode programatically
* Added event 'loadPano'
* Added example to add custom icon on the OpenLayers map and in the Street View Panorama
* Added mapsSize 'hidden' to allow Street View on full screen mode
* Removed interactjs from dependencies

## v2.0.1
* Ol7 compatibility
* Updated CDNs in examples

## v2.0.2
* Fixed panorama 'position_changed' event: prevent multiples fires at the same time
* Fixed panorama 'pov_changed' event: prevent triggers when no heading is changed
* Fixed typescript events
* Some minimal improvements in Documentation
* Example refactoring
* Added LICENSE file

## v2.0.3
* Added methods `getPegmanLayer` and `getStreetViewLayer`
* Removed unnecesary `Select` interaction
* Added `zoomOnInit` option

## v2.0.4
* Added `autoLoadGoogleMaps` attribute and `init` method to allow loading the Google Maps Library externally.
* Some internal refactoring to use `setMap` method

## v2.0.5
* Fixed bug on manual resizing the map using the scroll handler (missing css flex property)
* Added `ol-control` class to primary button
* Updated dependencies
* Some refactoring on rollup.config globals

## v2.0.6
* Fix events type
* Added enums
* Improved setMap (set to @public, allow null value to clean the control)
* Improved comments and documentation

## v2.0.7
* Fix umd export (missing enums)

## v2.1.0
* Updated dependencies
* Removed "browser" attribute from package.json
* Added "type" module attribute to package.json

## v2.1.1
* Improved rollup and ts configs

## v2.1.2
* Fixed bug that happened when pegman was moved outside the draggable area and later reentered
* Added ".js" extension on imports to work better with webpack 5 default config
* Lib is builded with es2017 target (dropped esnext)
* Removed babel deps
* Added header to dist files

## v2.2.0
* Added enums to the umd version
* Added pegman `transparent` mode
* Added `minZoom` option

## v2.2.1
* Added `touchmove` to animate the direction of pegman in touch devices
* Small fix to always center the pegman body below the cursor
* Some scss improvements

## v2.2.2
* Fix `minZoom` param on init

## v2.2.3
* Added `radius` option to allow customize the max displacement of Street View to retrieve the closest panorama
* Added `updatePegmanToClosestPanorama` option to allow update Pegman accordingly
* Force default StreetView zoom to `1`
* Updated to Ol8
* Updated dev dependencies

## v2.3.0
* Removed all document.body references to add/remove css classes. Now all of these are added in the map container or directly to the control button without polluting the document's body and preventing errors while using html components
* Improved cleanup and events when using `setMap(null)` method
* Improved example to allow set and unset the control map
* Prevent auto load Google Maps library multiple times if more than one instance is created
* Minor scss refactoring