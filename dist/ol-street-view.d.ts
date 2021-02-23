/// <reference types="googlemaps" />
import { Feature, PluggableMap, View } from 'ol';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Select, Translate } from 'ol/interaction';
import { Coordinate } from 'ol/coordinate';
import { EventsKey } from 'ol/events';
import './assets/css/ol-street-view.css';
/**
 * Street View implementation for Open Layers.
 *
 * @constructor
 * @param map Instance of the created map
 * @param opt_options StreetView options, see [StreetView Options](#options) for more details.
 */
export default class StreetView {
    protected options: Options;
    protected _i18n: i18n;
    map: PluggableMap;
    view: View;
    viewport: HTMLElement;
    protected _isInitialized: boolean;
    protected _isDragging: boolean;
    protected pegmanDivControl: HTMLElement;
    protected exitControlUI: HTMLButtonElement;
    protected pegmanDraggable: HTMLElement;
    protected streetViewPanoramaDiv: HTMLElement;
    protected mapContainer: HTMLElement;
    protected _keyClickOnMap: EventsKey | EventsKey[];
    protected _streetViewXyzLayer: TileLayer;
    protected _pegmanLayer: VectorLayer;
    protected _panorama: google.maps.StreetViewPanorama;
    protected _pegmanFeature: Feature;
    protected _pegmanSelectedCoords: Coordinate;
    protected _pegmanHeading: number;
    protected _selectPegman: Select;
    protected _translatePegman: Translate;
    protected _streetViewInitEvt: Event;
    protected _streetViewExitEvt: Event;
    protected _lastHeight: string;
    constructor(map: PluggableMap, opt_options?: Options);
    /**
     * @protected
     */
    _prepareLayers(): void;
    /**
     * @protected
     */
    _addMapInteractions(): void;
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
    _initStreetView(): void;
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
     * @public
     */
    showStreetView(): void;
    /**
     * Disables Street View mode
     * @public
     */
    hideStreetView(): void;
}
/**
 * **_[interface]_** - Custom Language
 * @protected
 */
interface i18n {
    exit: string;
    exitView: string;
    dragToInit: string;
    noImages: string;
    termsOfService: string;
    expand: string;
    minimize: string;
}
/**
 * **_[interface]_** - StreetView Options specified when creating an instance
 *
 * Default values:
 * ```javascript
 * {
 *   apiKey: null;
 *   size: 'lg';
 *   resizable: true;
 *   sizeToggler: true;
 *   language: 'en';
 * }
 * ```
 */
interface Options {
    /**
     * Google Maps Api Key
     * If not provided, the map will be in inverted colors withe the message "For development purposes only"
     */
    apiKey: string;
    /**
     * Size of the Pegman Control in the map
     */
    size: 'sm' | 'md' | 'lg';
    /**
     * To display a handler that enable dragging changing the height of the layout
     */
    resizable: boolean;
    /**
     * Control displayed once Street View is activated, to allow compact/expand the size of the map
     */
    sizeToggler: boolean;
    /**
     * Language support
     */
    language: 'es' | 'en';
}
export { Options, i18n };
