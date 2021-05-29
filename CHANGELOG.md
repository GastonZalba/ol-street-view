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