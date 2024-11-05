import Map from 'ol/Map.js';
import Feature from 'ol/Feature.js';
import VectorSource from 'ol/source/Vector.js';
import XYZ from 'ol/source/XYZ.js';
import Point from 'ol/geom/Point.js';
import Control from 'ol/control/Control.js';
import BaseEvent from 'ol/events/Event.js';
import VectorLayer from 'ol/layer/Vector.js';
import TileLayer from 'ol/layer/Tile.js';
import Translate from 'ol/interaction/Translate.js';
import { Coordinate } from 'ol/coordinate.js';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable.js';
import { EventsKey } from 'ol/events.js';
import { ObjectEvent } from 'ol/Object.js';
import { Types as ObjectEventTypes } from 'ol/ObjectEventType.js';
import { Loader } from '@googlemaps/js-api-loader';
import './assets/scss/ol-street-view.scss';
/**
 * Street View implementation for Open Layers.
 *
 * @constructor
 * @fires loadLib Fired after the Googlelibrary is loaded
 * @fires streetViewExit
 * @fires streetViewInit
 * @param opt_options StreetView options, see [StreetView Options](#options) for more details.
 * @extends {ol/control/Control~Control}
 */
export default class StreetView extends Control {
    protected _options: Options;
    protected _i18n: i18n;
    private _map;
    private _view;
    private _viewport;
    protected _isDragging: boolean;
    protected _isHidden: boolean;
    protected exitControlUI: HTMLButtonElement;
    protected pegmanDraggable: HTMLElement;
    protected pegmanDivControl: HTMLElement;
    protected _streetViewPanoramaEl: HTMLElement;
    protected mapContainer: HTMLElement;
    protected _sizeTogglerControl: Control;
    protected _clickOnMapEventKey: EventsKey;
    protected _translateEventKey: EventsKey;
    protected _viewResolutionEventKey: EventsKey;
    protected _streetViewXyzLayer: TileLayer<XYZ>;
    protected _addedXyzLayer: boolean;
    protected _pegmanLayer: VectorLayer<VectorSource>;
    protected _panorama: google.maps.StreetViewPanorama;
    protected _streetViewService: google.maps.StreetViewService;
    protected _pegmanFeature: Feature<Point>;
    protected _pegmanSelectedCoords: Coordinate;
    protected _pegmanHeading: number;
    protected _translatePegman: Translate;
    protected _lastHeight: string;
    protected _isPositionFired: boolean;
    protected _initialized: boolean;
    protected _scrollHandlerEl: HTMLElement;
    protected _interactDropzone: Interact.Interactable;
    protected _interactDraggable: Interact.Interactable;
    protected _interactResizable: Interact.Interactable;
    googleMapsLoader: Loader;
    on: OnSignature<EventTypes | `${SVEventTypes}`, BaseEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<`${SVEventTypes}` | ObjectEventTypes | EventTypes, EventsKey>;
    once: OnSignature<EventTypes | `${SVEventTypes}`, BaseEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<`${SVEventTypes}` | ObjectEventTypes | EventTypes, EventsKey>;
    un: OnSignature<EventTypes | `${SVEventTypes}`, BaseEvent, void> & OnSignature<ObjectEventTypes, ObjectEvent, void> & CombinedOnSignature<`${SVEventTypes}` | ObjectEventTypes | EventTypes, void>;
    constructor(opt_options?: Options);
    /**
     * Only use this method if `autoLoadGoogleMaps` is `false`. Call it after the Google Maps library is loaded.
     * Otherwise it will called automatically after the Maps Library is loaded.
     */
    init(): void;
    /**
     * Remove the control from its current map and attach it to the new map.
     * Pass null to just remove the control from the current map.
     * @param map
     */
    setMap(map: Map): void;
    /**
     * Show or hide the control depending on the zoom level
     */
    private _maybeHideControl;
    /**
     * @param bool
     */
    private _showControl;
    private _addTranslateInteraction;
    private _addTranslateInteractionEvent;
    private _remvoveTranslateInteractionEvent;
    private _prepareLayout;
    private _removeLayout;
    private _addPegmanInteraction;
    private _addMapControls;
    /**
     * @fires load
     */
    private _loadStreetView;
    private _updateStreetViewPosition;
    private _updatePegmanPosition;
    private _centerMapToPegman;
    private _initPegmanOnMap;
    private _showNoDataMode;
    /**
     * Map click listener to translate StreetView position
     */
    private _addClickListener;
    private _refreshMap;
    /**
     * Show Street View mode
     * @param coords Must be in the map projection format
     * @fires streetViewInit
     */
    private _showStreetView;
    /**
     * Add Stree View Layer showing areas wheres StreetView exists
     */
    private _addStreetViewXyzLayer;
    private _removeStreetViewXyzLayer;
    /**
     * This is useful if wou wanna add a custom icon on the panorama instance,
     * add custom listeners, etc
     * @returns {google.maps.StreetViewPanorama}
     */
    getStreetViewPanorama(): google.maps.StreetViewPanorama;
    /**
     * Get the Vector Layer in wich Pegman is displayed
     * @returns {VectorLayer<VectorSource>}
     */
    getPegmanLayer(): VectorLayer<VectorSource>;
    /**
     * Get the background Raster layer that displays the existing zones with Street View available
     * @returns {TileLayer<XYZ>}
     */
    getStreetViewLayer(): TileLayer<XYZ>;
    /**
     * Show Street View mode
     * @fires streetViewInit
     * @param {Coordinate} coords Must be in the map projection format
     * @returns {google.maps.StreetViewPanorama}
     */
    showStreetView(coords: Coordinate): google.maps.StreetViewPanorama;
    /**
     * Hide Street View, remove layers and clear features
     * @fires streetViewExit
     */
    hideStreetView(): void;
}
/**
 * **_[interface]_** - Custom Language
 * @public
 */
interface i18n {
    /**
     * Exit Street View visualization label
     */
    exit?: string;
    /**
     * Exit Street View visualization title label
     */
    exitView?: string;
    /**
     * Pegman icon title label on mouse hovering
     */
    dragToInit?: string;
    /**
     * Google Mpas library was not loaded
     */
    googleMapsLibraryError?: string;
    /**
     * No images information
     */
    noImages?: string;
    /**
     * Terms of Service
     */
    termsOfService?: string;
    /**
     * Expand map
     */
    expand?: string;
    /**
     * Minimize Map
     */
    minimize?: string;
}
/**
 * @public
 */
declare enum SVEventTypes {
    LOAD_LIB = "loadLib",
    STREET_VIEW_INIT = "streetViewInit",
    STREET_VIEW_EXIT = "streetViewExit"
}
/**
 * @public
 */
declare enum Language {
    ES = "es",
    EN = "en"
}
/**
 * @public
 */
declare enum BtnControlSize {
    Small = "sm",
    Medium = "md",
    Large = "lg"
}
/**
 * @public
 */
declare enum MapSize {
    Expanded = "expanded",
    Compact = "compact",
    Hidden = "hidden"
}
/**
 * **_[interface]_** - StreetView Options specified when creating an instance
 *
 * Default values:
 * ```javascript
 * {
 *   apiKey: null,
 *   size: 'lg',
 *   transparentButton: false,
 *   radius: 100,
 *   updatePegmanToClosestPanorama: true,
 *   zoomOnInit: 18,
 *   minZoom: null,
 *   resizable: true,
 *   sizeToggler: true,
 *   defaultMapSize: 'expanded',
 *   autoLoadGoogleMaps: true,
 *   language: 'en',
 *   i18n: {...} // Translations according to selected language
 * }
 * ```
 */
interface Options {
    /**
     * Official Google Maps Api Key
     * If not provided, the map will be in inverted colors with the message "For development purposes only"
     */
    apiKey?: string;
    /**
     * Size of the Pegman Control in the map
     */
    size?: `${BtnControlSize}`;
    /**
     * Hides the container button that holds Pegman
     */
    transparentButton?: boolean;
    /**
     * Maximum distance (in meters) that Street View can traslate to show the closest panorama
     */
    radius?: number;
    /**
     * If true, Pegman will traslate to the new location based on the maximum radius provided
     */
    updatePegmanToClosestPanorama?: boolean;
    /**
     * Zoom level on the map when init the Panorama
     */
    zoomOnInit?: number;
    /**
     * Minimum zoom level to show the Pegman control
     */
    minZoom?: number;
    /**
     * To display a handler that enable dragging changing the height of the layout
     */
    resizable?: boolean;
    /**
     * Control displayed once Street View is activated, to allow compact/expand the size of the map
     */
    sizeToggler?: boolean;
    /**
     * Default size of the map when the Street View is activated
     */
    defaultMapSize?: `${MapSize}`;
    /**
     * To configure if the Google Maps Library should be called automatically.
     * `false` if you are going to load it on your own. If so, you must run the `init` method AFTER the library is loaded. In this case the event 'loadLib' will not be fired.
     */
    autoLoadGoogleMaps?: boolean;
    /**
     * Specify a target if you want the control to be rendered outside of the map's viewport.
     * For Ol5, you must set a target to prevent the control from being rendered at the default
     * target ("ol-overlaycontainer-stopevent"), otherwise the control will not work.
     */
    target?: HTMLElement | string;
    /**
     * Language support
     */
    language?: `${Language}`;
    /**
     * Add custom translations
     * Default is according to selected language
     */
    i18n?: i18n;
}
export { Options, i18n, SVEventTypes, Language, BtnControlSize, MapSize };
//# sourceMappingURL=ol-street-view.d.ts.map