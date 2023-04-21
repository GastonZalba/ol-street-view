/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
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
    protected options: Options;
    protected _i18n: i18n;
    private _map;
    private _view;
    private _viewport;
    protected _isDragging: boolean;
    protected pegmanDivControl: HTMLElement;
    protected exitControlUI: HTMLButtonElement;
    protected pegmanDraggable: HTMLElement;
    protected streetViewPanoramaDiv: HTMLElement;
    protected mapContainer: HTMLElement;
    protected _keyClickOnMap: EventsKey | EventsKey[];
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
    protected _loadedLib: boolean;
    protected _initialized: boolean;
    on: OnSignature<EventTypes | `${SVEventTypes}`, BaseEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<`${SVEventTypes}` | ObjectEventTypes | EventTypes, EventsKey>;
    once: OnSignature<EventTypes | `${SVEventTypes}`, BaseEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<`${SVEventTypes}` | ObjectEventTypes | EventTypes, EventsKey>;
    un: OnSignature<EventTypes | `${SVEventTypes}`, BaseEvent, void> & OnSignature<ObjectEventTypes, ObjectEvent, void> & CombinedOnSignature<`${SVEventTypes}` | ObjectEventTypes | EventTypes, void>;
    constructor(opt_options?: Options);
    /**
     * Only use this method if `autoLoadGoogleMaps` is `false`. Call it after the Google Maps library is loaded.
     * Otherwise it will called automatically after the Maps Library is loaded.
     * @public
     * @returns
     */
    init(): void;
    /**
     * Remove the control from its current map and attach it to the new map.
     * Pass null to just remove the control from the current map.
     * @param map
     * @public
     */
    setMap(map: Map): void;
    /**
     * @protected
     */
    _prepareLayers(): void;
    /**
     * @protected
     */
    _addTranslateInteraction(): void;
    /**
     * @protected
     */
    _prepareLayout(): void;
    /**
     * @protected
     */
    _createMapControls(): void;
    /**
     * @protected
     * @fires load
     */
    _loadStreetView(): Promise<void>;
    /**
     * @protected
     */
    _updateStreetViewPosition(coords: Coordinate): void;
    /**
     * @protected
     */
    _updatePegmanPosition(coords: Coordinate | google.maps.LatLng, isGoogleFormat?: boolean): void;
    /**
     * @protected
     */
    _centerMapToPegman(): void;
    /**
     * @protected
     */
    _initPegmanOnMap(): void;
    /**
     * @protected
     */
    _showNoDataMode(): void;
    /**
     * Map click listener to translate StreetView position
     *
     * @protected
     */
    _addClickListener(): void;
    /**
     * @protected
     */
    _refreshMap(centerToPegman?: boolean): void;
    /**
     * Show Street View mode
     * @param coords Must be in the map projection format
     * @fires streetViewInit
     * @protected
     */
    _showStreetView(coords: Coordinate): void;
    /**
     * Add Stree View Layer showing areas wheres StreetView exists
     * @protected
     */
    _addStreetViewXyzLayer(): void;
    /**
     * @protected
     */
    _removeStreetViewXyzLayer(): void;
    /**
     * This is useful if wou wanna add a custom icon on the panorama instance,
     * add custom listeners, etc
     * @public
     * @returns {google.maps.StreetViewPanorama}
     */
    getStreetViewPanorama(): google.maps.StreetViewPanorama;
    /**
     * Get the Vector Layer in wich Pegman is displayed
     * @public
     * @returns {VectorLayer<VectorSource>}
     */
    getPegmanLayer(): VectorLayer<VectorSource>;
    /**
     * Get the background Raster layer that displays the existing zones with Street View available
     * @public
     * @returns {TileLayer<XYZ>}
     */
    getStreetViewLayer(): TileLayer<XYZ>;
    /**
     * Show Street View mode
     * @fires streetViewInit
     * @param {Coordinate} coords Must be in the map projection format
     * @returns {google.maps.StreetViewPanorama}
     * @public
     */
    showStreetView(coords: Coordinate): google.maps.StreetViewPanorama;
    /**
     * Hide Street View, remove layers and clear features
     * @fires streetViewExit
     * @public
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
 *   zoomOnInit: 18,
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
     * Zoom level on the map when init the Panorama
     */
    zoomOnInit?: number;
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