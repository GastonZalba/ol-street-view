import { transform } from 'ol/proj';
import { Feature, PluggableMap, View } from 'ol';
import { Style, Icon } from 'ol/style';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Select, Translate } from 'ol/interaction';
import { Point } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import { unByKey } from 'ol/Observable';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import { EventsKey } from 'ol/events';

import interact from 'interactjs';
import { Loader } from 'google-maps';


let google;

const STREET_VIEW_MAX_DISTANCE = 100; // meters

class StreetView {

    protected options: Options;

    // Ol
    public map: PluggableMap;
    public view: View;
    public viewport: HTMLElement;

    protected _isInitialized: boolean;

    // Control
    protected pegmanBtn: HTMLElement;
    protected exitControlUI: HTMLButtonElement;
    protected pegmanDraggable: HTMLElement;
    protected streetViewContainer: HTMLElement;

    // Obserbable keys
    protected _keyClickOnMap: EventsKey | EventsKey[];

    protected _streetViewXyzLayer: TileLayer;
    protected _pegmanLayer: VectorLayer;

    protected _panorama: any;
    protected _pegmanFeature: Feature;

    protected _pegmanSelectedCoords: Coordinate;
    protected _pegmanHeading: number;

    protected _selectPegman: Select;
    protected _translatePegman: Translate;

    protected _clickListener: any;

    // Events
    protected _streetViewInitEvt: Event;
    protected _streetViewExitEvt: Event;

    constructor(map: PluggableMap, opt_options?: Options) {

        // Default options
        this.options = {
            apiKey: null,
            language: 'en',
            ...opt_options 
        }

        this.map = map;
        this.view = map.getView();
        this.viewport = map.getTargetElement();

        this._pegmanSelectedCoords = [];
        this._pegmanHeading = 180;

        this._streetViewInitEvt = new Event('streetViewInit');
        this._streetViewExitEvt = new Event('streetViewExit');

        this._prepareLayers();
        this._addMapInteractions();
        this._createControl();

    }

    _prepareLayers(): void {

        const getPegmanIconOffset = () => {

            let heading = this._pegmanHeading;

            let offset: Array<number>;

            if (heading >= 0 && heading < 22.5) {
                offset = [0, 0]
            } else if (heading >= 22.5 && heading < 45) {
                offset = [0, 52]
            } else if (heading >= 45 && heading < 67.5) {
                offset = [0, 104]
            } else if (heading >= 67.5 && heading < 90) {
                offset = [0, 156]
            } else if (heading >= 90 && heading < 112.5) {
                offset = [0, 208]
            } else if (heading >= 112.5 && heading < 135) {
                offset = [0, 260]
            } else if (heading >= 135 && heading < 157.5) {
                offset = [0, 312]
            } else if (heading >= 157.5 && heading < 180) {
                offset = [0, 364]
            } else if (heading >= 180 && heading < 205.5) {
                offset = [0, 416]
            } else if (heading >= 205.5 && heading < 225) {
                offset = [0, 468]
            } else if (heading >= 225 && heading < 247.5) {
                offset = [0, 520]
            } else if (heading >= 247.5 && heading < 270) {
                offset = [0, 572]
            } else if (heading >= 270 && heading < 292.5) {
                offset = [0, 624]
            } else if (heading >= 292.5 && heading < 315) {
                offset = [0, 676]
            } else if (heading >= 315 && heading < 337.5) {
                offset = [0, 728]
            } else if (heading >= 337.5) {
                offset = [0, 780]
            }

            return offset;
        }


        // Street View XYZ Layer
        // It's activated once pegman is dragged
        this._streetViewXyzLayer = new TileLayer({
            zIndex: 10,
            source: new XYZ({
                url: 'https://mt1.google.com/vt/?lyrs=svv|cb_client:apiv3&style=40,18&x={x}&y={y}&z={z}' // Google
            })
        });

        // Current Pegman Layer Position
        this._pegmanLayer = new VectorLayer({
            zIndex: 99,
            source: new VectorSource(),
            style: () => new Style({
                image: new Icon(({
                    anchor: [0.5, 46],
                    anchorXUnits: IconAnchorUnits.FRACTION,
                    anchorYUnits: IconAnchorUnits.PIXELS,
                    rotateWithView: true,
                    opacity: 1.00,
                    src: '/images/markers/pegman_sprites.png',
                    size: [52, 52],
                    offset: getPegmanIconOffset()
                }))
            })
        })

        this.map.addLayer(this._pegmanLayer);

    }

    _addMapInteractions(): void {

        const translatePegmanHandler = (evt): void => {

            this._pegmanSelectedCoords = evt.coordinate;
            this._updateStreetViewPosition(this._pegmanSelectedCoords);

        }

        this._selectPegman = new Select();

        this._translatePegman = new Translate({
            features: this._selectPegman.getFeatures()
        });

        this._translatePegman.on('translateend', translatePegmanHandler);

        this.map.addInteraction(this._translatePegman);
    }

    _createControl(): void {

        this.pegmanBtn = document.createElement('div');
        this.pegmanBtn.id = 'pegmanButtonDiv';
        this.pegmanBtn.className = 'tooltip-cnt';
        this.pegmanBtn.title = 'Arrastrar para iniciar Google Street View';

        this.pegmanDraggable = document.createElement('div');
        this.pegmanDraggable.id = "pegmanMarker";
        this.pegmanDraggable.className = 'draggable drag-drop';

        this.pegmanBtn.innerHTML = `
            <div id="pegmanMarker" class="draggable drag-drop"></div>
            <div id="pegmanButton"></div>
            `;

        this.viewport.appendChild(this.pegmanBtn);
        this.pegmanDraggable = document.querySelector('#pegmanButtonDiv .draggable');

        this._addPegmanInteraction();

        this._addStreetViewHtml();

    }


    _addPegmanInteraction(): void {

        let direction = '', oldx = 0;

        // Grab Left/Right Direction of Mouse for Pegman Image
        const mousemovemethod = (e: MouseEvent) => {

            // Left
            if (e.pageX < oldx) {

                direction = 'left';
                this.pegmanDraggable.classList.add('left');
                this.pegmanDraggable.classList.remove('right');

                // Right
            } else if (e.pageX > oldx) {
                direction = 'right';
                this.pegmanDraggable.classList.add('right');
                this.pegmanDraggable.classList.remove('left');
            }
            oldx = e.pageX;

            return oldx;
        }

        interact('.draggable').draggable({
            inertia: false,
            onmove: (e) => {

                document.addEventListener('mousemove', mousemovemethod.bind(this));

                // Remove Class 'dropped' if Exists
                this.pegmanDraggable.classList.remove('dropped');

                let pTarget = e.target,

                    // Keep the Dragged Position in the data-x/data-y Attributes
                    x = (parseFloat(pTarget.getAttribute('data-x')) || 0) + e.dx,
                    y = (parseFloat(pTarget.getAttribute('data-y')) || 0) + e.dy;

                // Translate the Element
                pTarget.style.webkitTransform =
                    pTarget.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

                // Update the Posiion Attributes
                pTarget.setAttribute('data-x', x);
                pTarget.setAttribute('data-y', y);
            },
            onend: (e) => {

                let location = this.map.getCoordinateFromPixel([e.client.x - 60, e.client.y + this.pegmanDraggable.clientHeight]);
                this._pegmanSelectedCoords = location;
                this._addPegmanToMap();

                // Reset Pegman Dragging Cursor
                this.pegmanDraggable.classList.remove('can-drop', 'dragged', 'left', 'right', 'active', 'dropped');

                this.pegmanDraggable.removeAttribute('style')
                this.pegmanDraggable.removeAttribute('data-x')
                this.pegmanDraggable.removeAttribute('data-y');
            }
        }).styleCursor(false);

        // Enable Draggables to be Dropped into this Container
        interact(this.viewport).dropzone({

            // Only Accept Elements Matching this CSS Selector
            accept: '.draggable',
            // Require a 75% Element Overlap for a Drop to be Possible
            overlap: 0.75,

            // Listen for Drop Related Events:
            ondropactivate: (e) => {

                // Add Active Dropzone Feedback
                e.target.classList.add('drop-active');
            },
            ondragenter: (e) => {

                let draggableElement = e.relatedTarget,
                    dropzoneElement = e.target;

                // Add SV Layer
                this.map.addLayer(this._streetViewXyzLayer);

                document.body.classList.add('streetViewModeOnDragging')

                // Add Class 'active' While Dragging
                this.pegmanDraggable.classList.add('active');

                // Feedback the Possibility of a Drop
                dropzoneElement.classList.add('drop-target');
                draggableElement.classList.add('can-drop');
            },
            ondragleave: (e) => {

                // Remove the Drop Feedback Style
                e.target.classList.remove('drop-target');
                e.relatedTarget.classList.remove('can-drop');
            },
            ondrop: (e) => {

                this.pegmanDraggable.classList.remove('active', 'left', 'right');
                this.pegmanDraggable.classList.add('dropped');

                // Reset Pegman Dragging Cursor
                this.pegmanDraggable.classList.remove('can-drop', 'dragged', 'left', 'right', 'active', 'dropped');

                this.pegmanDraggable.removeAttribute('style')
                this.pegmanDraggable.removeAttribute('data-x')
                this.pegmanDraggable.removeAttribute('data-y');

            },
            ondropdeactivate: (e) => {
                this.pegmanDraggable.classList.remove('active', 'left', 'right');
                document.body.classList.remove('streetViewModeOnDragging');

                // Remove Active Dropzone Feedback
                e.target.classList.remove('drop-active');
                e.target.classList.remove('drop-target');
            }
        });
    }

    async _addStreetViewHtml(): Promise<void> {

        this.streetViewContainer = document.createElement('div');
        this.streetViewContainer.id = 'streetView';

        const streetViewNoResultsDiv = document.createElement('div');
        streetViewNoResultsDiv.className = 'no-results';
        streetViewNoResultsDiv.innerHTML = `
            <div class="no-results-icon icon-visibility_off"></DIV>
            <div class="no-results-text">Sin imágenes en la zona. Click en el mapa para trasladarse.</div>
        `;
        this.streetViewContainer.appendChild(streetViewNoResultsDiv);

        // Create exit control div
        this.exitControlUI = document.createElement('button');
        this.exitControlUI.innerHTML = "SALIR";
        this.exitControlUI.type = "button";
        this.exitControlUI.className = "gm-control-active gm-control-exit";
        this.exitControlUI.title = "Salir de la vista Street View";
        //this.exitControlUI.index = 1;
        this.exitControlUI.onclick = this.hideStreetView.bind(this);

        streetViewNoResultsDiv.appendChild(this.exitControlUI);

        this.viewport.parentElement.appendChild(this.streetViewContainer);

        const loader = new Loader(this.options.apiKey);

        try {
            google = await loader.load();
        } catch (err) {
            console.error(err)
        }

    }

    _updateStreetViewPosition(coords): void {

        let latLon = transform(coords, this.view.getProjection(), 'EPSG:4326').reverse();
        let latLonGoogle = { lat: latLon[0], lng: latLon[1] };

        let streetViewService = new google.maps.StreetViewService();

        streetViewService.getPanoramaByLocation(latLonGoogle, STREET_VIEW_MAX_DISTANCE, (_, status) => {
            if (status === google.maps.StreetViewStatus.OK) {
                this._panorama.setPosition(latLonGoogle);
                this._panorama.setVisible(true);
            } else {
                this._showNoData();
                this._updatePegmanPosition(coords, /** transform = */ false);
            }
        });

    }

    _updatePegmanPosition(coords, transf = true):void {

        if (transf) {
            coords = transform([coords.lng(), coords.lat()], 'EPSG:4326', this.view.getProjection());
        }

        this._pegmanSelectedCoords = coords;

        (this._pegmanFeature.getGeometry() as Point).setCoordinates(this._pegmanSelectedCoords);

        this.view.animate({
            center: coords,
            duration: 100
        });

    }

    _initStreetView():void {

        this._panorama = new google.maps.StreetViewPanorama(this.streetViewContainer, {
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
            visible: false,
            motionTracking: false,
            motionTrackingControl: false,
            radius: STREET_VIEW_MAX_DISTANCE
        });

        this._panorama.addListener("position_changed", () => {
            let position = this._panorama.getPosition();
            this._updatePegmanPosition(position);
        });

        this._panorama.addListener("pov_changed", () => {
            let heading = this._panorama.getPov().heading;
            this._pegmanHeading = heading;
            this._pegmanLayer.getSource().refresh();
        });

        let exitControlST = this.exitControlUI.cloneNode(true);
        (exitControlST as HTMLButtonElement).onclick = this.hideStreetView.bind(this);

        this._panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push(exitControlST);

        this._isInitialized = true;
    }


    showStreetView():void {

        // Only init one time
        if (!this._isInitialized) {
            this._initStreetView();
        }

        this._updateStreetViewPosition(this._pegmanSelectedCoords)
        this._panorama.setVisible(true);
        this._addClickListener();
        this.viewport.dispatchEvent(this._streetViewInitEvt);

    }

    hideStreetView():void {
    
        this._selectPegman.getFeatures().clear();

        let pegmanLayerSource = this._pegmanLayer.getSource();

        pegmanLayerSource.clear();

        this._pegmanSelectedCoords = [];

        // Remove SV Layer
        this.map.removeLayer(this._streetViewXyzLayer);

        document.body.classList.remove('streetViewMode');

        // Force refresh the layers
        this.map.updateSize();
        window.dispatchEvent(new Event('resize'));

        this._panorama.setVisible(false);

        unByKey(this._keyClickOnMap);

        // Maybe, exit fullscreen
        if (document.fullscreenElement) document.exitFullscreen();

        this.viewport.dispatchEvent(this._streetViewExitEvt);

    }


    _addPegmanToMap():void {

        if (this._pegmanLayer.getSource().getFeatures().length) {
            return;
        }

        // Add Class to Body
        if (!document.body.classList.contains('streetViewMode')) {
            document.body.classList.add('streetViewMode')

            // Update Map Size
            this.map.updateSize();
        }

        this._selectPegman.getFeatures().clear();

        if (!Object.keys(this._pegmanSelectedCoords)) this._pegmanSelectedCoords = this.view.getCenter();

        this._pegmanFeature = new Feature({
            name: 'Pegman',
            geometry: new Point(this._pegmanSelectedCoords)
        });

        this._pegmanLayer.getSource().addFeature(this._pegmanFeature);

        this._selectPegman.getFeatures().push(this._pegmanFeature);

        this.view.setCenter(this._pegmanSelectedCoords);
        this.view.setZoom(18);
        this.showStreetView();

    }

    _showNoData(): void {
        this._panorama.setVisible(false);
    }

    _addClickListener(): void {

        const clickListener = (e) => {
            let position = this.map.getCoordinateFromPixel(e.pixel);
            this._updateStreetViewPosition(position);
            e.preventDefault();
            e.stopPropagation();
        }

        this._clickListener = clickListener.bind(this);

        this._keyClickOnMap = this.map.on('click', this._clickListener);
    }

}

interface Options {
    apiKey: string;
    language: string;
}

export default StreetView;