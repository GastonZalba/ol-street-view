/// <reference types="googlemaps" />
import { Feature, PluggableMap, View } from 'ol';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Select, Translate } from 'ol/interaction';
import { Coordinate } from 'ol/coordinate';
import { EventsKey } from 'ol/events';
import './assets/css/ol-street-view.css';
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
    protected streetViewContainer: HTMLElement;
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
    _createControl(): void;
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
     * @public
     */
    showStreetView(): void;
    /**
     * @public
     */
    hideStreetView(): void;
}
interface i18n {
    exit: string;
    exitView: string;
    dragToInit: string;
    noImages: string;
}
interface Options {
    apiKey: string;
    small: boolean;
    language: 'es' | 'en';
}
export { Options, i18n };
