/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
import { Feature, Map, View } from 'ol';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Select, Translate } from 'ol/interaction';
import { Coordinate } from 'ol/coordinate';
import { EventsKey } from 'ol/events';
import { Control } from 'ol/control';
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
    protected _isInitialized: boolean;
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
    protected _pegmanFeature: Feature;
    protected _pegmanSelectedCoords: Coordinate;
    protected _pegmanHeading: number;
    protected _selectPegman: Select;
    protected _translatePegman: Translate;
    protected _lastHeight: string;
    constructor(opt_options?: Options);
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
     * @param coords Muste be im the map projection format
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
 * @protected
 */
interface i18n {
    exit?: string;
    exitView?: string;
    dragToInit?: string;
    noImages?: string;
    termsOfService?: string;
    expand?: string;
    minimize?: string;
}
/**
 * **_[interface]_** - StreetView Options specified when creating an instance
 *
 * Default values:
 * ```javascript
 * {
 *   apiKey: null,
 *   size: 'lg',
 *   resizable: true,
 *   sizeToggler: true,
 *   defaultMapSize: 'expanded',
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
export { Options, i18n };
//# sourceMappingURL=ol-street-view.d.ts.map