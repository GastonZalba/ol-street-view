/// <reference types="googlemaps" />
import { Feature, PluggableMap, View } from 'ol';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Select, Translate } from 'ol/interaction';
import { Coordinate } from 'ol/coordinate';
import { EventsKey } from 'ol/events';
import './assets/css/ol-street-view.css';
export default class StreetView {
    protected options: Options;
    map: PluggableMap;
    view: View;
    viewport: HTMLElement;
    protected _isInitialized: boolean;
    protected pegmanBtn: HTMLElement;
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
    _prepareLayers(): void;
    _addMapInteractions(): void;
    _createControl(): void;
    _addPegmanInteraction(): void;
    /**
     * Create the streView container
     * and move the map inside another parent container
     */
    _addStreetViewHtml(): void;
    _loadStreetView(): Promise<void>;
    _updateStreetViewPosition(coords: Coordinate): void;
    _updatePegmanPosition(coords: Coordinate | google.maps.LatLng, isGoogleFormat?: boolean): void;
    _initStreetView(): void;
    showStreetView(): void;
    hideStreetView(): void;
    _addPegmanToMap(): void;
    _showNoData(): void;
    _addClickListener(): void;
}
interface Options {
    apiKey: string;
    language: string;
}
export { Options };
