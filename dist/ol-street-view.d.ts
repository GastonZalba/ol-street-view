/// <reference types="googlemaps" />
import { Feature, Map, View } from 'ol';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Translate } from 'ol/interaction';
import { Point } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable';
import { EventsKey } from 'ol/events';
import { Control } from 'ol/control';
import BaseEvent from 'ol/events/Event';
import { ObjectEvent } from 'ol/Object';
import { Types as ObjectEventTypes } from 'ol/ObjectEventType';
import './assets/scss/ol-street-view.scss';
/**
 * Street View implementation for Open Layers.
 *
 * @constructor
 * @fires loadLib
 * @fires streetViewExit
 * @fires streetViewInit
 * @param opt_options StreetView options, see [StreetView Options](#options) for more details.
 * @extends {ol/control/Control~Control}
 */
export default class StreetView extends Control {
    protected options: Options;
    protected _i18n: i18n;
    _map: Map;
    _view: View;
    _viewport: HTMLElement;
    protected _isDragging: boolean;
    protected pegmanDivControl: HTMLElement;
    protected exitControlUI: HTMLButtonElement;
    protected pegmanDraggable: HTMLElement;
    protected streetViewPanoramaDiv: HTMLElement;
    protected mapContainer: HTMLElement;
    protected _keyClickOnMap: EventsKey | EventsKey[];
    protected _streetViewXyzLayer: TileLayer<XYZ>;
    protected _pegmanLayer: VectorLayer<VectorSource>;
    protected _panorama: google.maps.StreetViewPanorama;
    protected _streetViewService: google.maps.StreetViewService;
    protected _pegmanFeature: Feature<Point>;
    protected _pegmanSelectedCoords: Coordinate;
    protected _pegmanHeading: number;
    protected _translatePegman: Translate;
    protected _lastHeight: string;
    protected _isPositionFired: boolean;
    on: OnSignature<EventTypes | StreetViewEventTypes, BaseEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<StreetViewEventTypes | ObjectEventTypes | EventTypes, EventsKey>;
    once: OnSignature<EventTypes | StreetViewEventTypes, BaseEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<StreetViewEventTypes | ObjectEventTypes | EventTypes, EventsKey>;
    un: OnSignature<EventTypes | StreetViewEventTypes, BaseEvent, void> & OnSignature<ObjectEventTypes, ObjectEvent, void> & CombinedOnSignature<StreetViewEventTypes | ObjectEventTypes | EventTypes, void>;
    constructor(opt_options?: Options);
    /**
     * Call this function after the Google Maps library is loaded if autoLoadGoogleMaps is `false`.
     * Otherwise it will called automatically after the Maps Library is loaded.
     * @public
     */
    init(): void;
    /**
     * @protected
     * @param map
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
     * @protected
     */
    _showStreetView(coords: Coordinate): void;
    /**
     * Add Stree View Layer showing areas wheres StreetView exists
     * @protected
     */
    _addStreetViewLayer(): void;
    /**
     * This is useful if wou wanna add a custom icon on the panorama instance,
     * add custom listeners, etc
     * @public
     * @returns
     */
    getStreetViewPanorama(): google.maps.StreetViewPanorama;
    /**
     * Get the Vector Layer in wich the Pegman is displayer
     * @public
     * @returns
     */
    getPegmanLayer(): VectorLayer<VectorSource>;
    /**
     * Get the background Raster layer that display the existing zones with Street View available
     * @public
     * @returns
     */
    getStreetViewLayer(): TileLayer<XYZ>;
    /**
     * Show Street View mode
     * @param coords Must be in the map projection format
     * @returns
     * @public
     */
    showStreetView(coords: Coordinate): google.maps.StreetViewPanorama;
    /**
     * Disables Street View mode
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
declare enum SVEventTypes {
    LOAD_LIB = "loadLib",
    STREET_VIEW_INIT = "streetViewInit",
    STREET_VIEW_EXIT = "streetViewExit"
}
/**
 * Street View Event Types
 * @public
 */
declare type StreetViewEventTypes = SVEventTypes.LOAD_LIB | SVEventTypes.STREET_VIEW_EXIT | SVEventTypes.STREET_VIEW_INIT;
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
     * Google Maps Api Key
     * If not provided, the map will be in inverted colors with the message "For development purposes only"
     */
    apiKey: string;
    /**
     * Size of the Pegman Control in the map
     */
    size?: 'sm' | 'md' | 'lg';
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
    defaultMapSize?: 'expanded' | 'compact' | 'hidden';
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
    language?: 'es' | 'en';
    /**
     * Add custom translations
     */
    i18n?: i18n;
}
export { Options, i18n, StreetViewEventTypes };
//# sourceMappingURL=ol-street-view.d.ts.map