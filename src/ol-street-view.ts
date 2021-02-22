import { Feature, PluggableMap, View } from 'ol';
import { transform } from 'ol/proj';
import { Style, Icon } from 'ol/style';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Select, Translate } from 'ol/interaction';
import { Point } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import { unByKey } from 'ol/Observable';
import { EventsKey } from 'ol/events';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import { TranslateEvent } from 'ol/interaction/Translate';

// External
import interact from 'interactjs';
import { Loader } from 'google-maps';

// Images
import pegmanMarkerSprites from './assets/images/pegman_marker.png';

import * as languages from './assets/i18n/index';

// Css
import './assets/css/ol-street-view.css';

let google;

const SV_MAX_DISTANCE_METERS = 100;

export default class StreetView {
    protected options: Options;
    protected _i18n: i18n;

    // Ol
    public map: PluggableMap;
    public view: View;
    public viewport: HTMLElement;

    protected _isInitialized: boolean;
    protected _isDragging: boolean;

    // Control
    protected pegmanDivControl: HTMLElement;
    protected exitControlUI: HTMLButtonElement;
    protected pegmanDraggable: HTMLElement;
    protected streetViewContainer: HTMLElement;
    protected mapContainer: HTMLElement;

    // Obserbable keys
    protected _keyClickOnMap: EventsKey | EventsKey[];

    // Layers
    protected _streetViewXyzLayer: TileLayer;
    protected _pegmanLayer: VectorLayer;

    protected _panorama: google.maps.StreetViewPanorama;

    // Pegman
    protected _pegmanFeature: Feature;
    protected _pegmanSelectedCoords: Coordinate;
    protected _pegmanHeading: number;
    protected _selectPegman: Select;
    protected _translatePegman: Translate;

    // Events
    protected _streetViewInitEvt: Event;
    protected _streetViewExitEvt: Event;

    constructor(map: PluggableMap, opt_options?: Options) {
        // Default options
        this.options = {
            apiKey: null,
            language: 'en',
            size: 'bg',
            ...opt_options
        };

       // Language support
        this._i18n = languages[this.options.language];

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
        this._loadStreetView();
    }

    /**
     * @protected
     */
    _prepareLayers(): void {
        const calculatePegmanIconOffset = (): Array<number> => {
            const heading = this._pegmanHeading;

            let offset: Array<number>;

            // Calculating the sprite offset 
            if (heading >= 0 && heading < 22.5) {
                offset = [0, 0];
            } else if (heading >= 22.5 && heading < 45) {
                offset = [0, 52];
            } else if (heading >= 45 && heading < 67.5) {
                offset = [0, 104];
            } else if (heading >= 67.5 && heading < 90) {
                offset = [0, 156];
            } else if (heading >= 90 && heading < 112.5) {
                offset = [0, 208];
            } else if (heading >= 112.5 && heading < 135) {
                offset = [0, 260];
            } else if (heading >= 135 && heading < 157.5) {
                offset = [0, 312];
            } else if (heading >= 157.5 && heading < 180) {
                offset = [0, 364];
            } else if (heading >= 180 && heading < 205.5) {
                offset = [0, 416];
            } else if (heading >= 205.5 && heading < 225) {
                offset = [0, 468];
            } else if (heading >= 225 && heading < 247.5) {
                offset = [0, 520];
            } else if (heading >= 247.5 && heading < 270) {
                offset = [0, 572];
            } else if (heading >= 270 && heading < 292.5) {
                offset = [0, 624];
            } else if (heading >= 292.5 && heading < 315) {
                offset = [0, 676];
            } else if (heading >= 315 && heading < 337.5) {
                offset = [0, 728];
            } else if (heading >= 337.5) {
                offset = [0, 780];
            }

            return offset;
        };

        // Street View XYZ Layer
        // It's activated once pegman is dragged
        this._streetViewXyzLayer = new TileLayer({
            zIndex: 10,
            source: new XYZ({
                attributions: `&copy; ${new Date().getFullYear()} Google Maps <a href="https://www.google.com/help/terms_maps/" target="_blank">${this._i18n.termsOfService}</a>`,
                maxZoom: 19,
                url: 'https://mt1.google.com/vt/?lyrs=svv|cb_client:apiv3&style=40,18&x={x}&y={y}&z={z}'
            })
        });

        // Pegman Layer
        this._pegmanLayer = new VectorLayer({
            zIndex: 99,
            source: new VectorSource(),
            style: () =>
                new Style({
                    image: new Icon({
                        anchor: [0.5, 48],
                        anchorXUnits: IconAnchorUnits.FRACTION,
                        anchorYUnits: IconAnchorUnits.PIXELS,
                        rotateWithView: true,
                        opacity: 1.0,
                        src: pegmanMarkerSprites as string,
                        size: [48, 48],
                        offset: calculatePegmanIconOffset()
                    })
                })
        });

        this.map.addLayer(this._pegmanLayer);
    }

    /**
     * @protected
     */
    _addMapInteractions(): void {
        const translatePegmanHandler = (evt: TranslateEvent): void => {
            this._pegmanSelectedCoords = evt.coordinate;
            this._updateStreetViewPosition(this._pegmanSelectedCoords);
        };

        this._selectPegman = new Select();

        this._translatePegman = new Translate({
            features: this._selectPegman.getFeatures()
        });

        this._translatePegman.on('translateend', translatePegmanHandler);

        this.map.addInteraction(this._translatePegman);
    }

    /**
     * @protected
     */
    _createControl(): void {
        /**
         * Create the streView container
         * and move the map inside another parent container
         *
         * @protected
         */
        const addStreetViewHtml = (): void => {
            this.streetViewContainer = document.createElement('div');
            this.streetViewContainer.id = 'ol-street-view';

            const streetViewNoResultsDiv = document.createElement('div');
            streetViewNoResultsDiv.className = 'ol-street-view--no-results';
            streetViewNoResultsDiv.innerHTML = `
            <div class="ol-street-view--no-results-icon icon-visibility_off"></div>
            <div class="ol-street-view--no-results-text">${this._i18n.noImages}</div>
        `;
            this.streetViewContainer.appendChild(streetViewNoResultsDiv);

            // Create exit control div
            this.exitControlUI = document.createElement('button');
            this.exitControlUI.innerHTML = this._i18n.exit;
            this.exitControlUI.type = 'button';
            this.exitControlUI.className = 'gm-control-active gm-control-exit';
            this.exitControlUI.title = this._i18n.exitView;
            //this.exitControlUI.index = 1;
            this.exitControlUI.onclick = this.hideStreetView.bind(this);

            streetViewNoResultsDiv.appendChild(this.exitControlUI);

            const parentMap = this.viewport.parentElement;

            this.mapContainer = document.createElement('div');
            this.mapContainer.id = 'ol-street-view--map-container';

            // Move the map element (viewport) inside a new container
            parentMap.replaceChild(this.mapContainer, this.viewport);

            this.mapContainer.appendChild(this.streetViewContainer);
            this.mapContainer.appendChild(this.viewport);

            this.viewport.classList.add('ol-street-view--map');
        };

        /**
         * @protected
         */
        const addPegmanInteraction = (): void => {
            let oldPosX = 0,
                stopInteract;

            // Grab Left/Right Direction of Mouse for Pegman Image
            let onMouseMove: EventListener = (e: MouseEvent) => {
                // Left
                if (e.pageX < oldPosX) {
                    this.pegmanDraggable.classList.add('ol-street-view--left');
                    this.pegmanDraggable.classList.remove(
                        'ol-street-view--right'
                    );

                    // Right
                } else if (e.pageX > oldPosX) {
                    this.pegmanDraggable.classList.add('ol-street-view--right');
                    this.pegmanDraggable.classList.remove(
                        'ol-street-view--left'
                    );
                }

                oldPosX = e.pageX;

                return oldPosX;
            };

            onMouseMove = onMouseMove.bind(this);

            /**
             * @protected
             */
            const terminateDragging = (): void => {
                this._isDragging = false;

                document.body.classList.remove(
                    'ol-street-view--activated-on-dragging'
                );

                // Reset Pegman
                this.pegmanDraggable.classList.remove(
                    'ol-street-view--can-drop',
                    'ol-street-view--dragged',
                    'ol-street-view--left',
                    'ol-street-view--right',
                    'ol-street-view--active',
                    'ol-street-view--dropped'
                );
                this.pegmanDraggable.removeAttribute('style');
                this.pegmanDraggable.removeAttribute('data-x');
                this.pegmanDraggable.removeAttribute('data-y');

                // Remove Dropzone Feedback
                this.viewport.classList.remove(
                    'ol-street-view--drop-active',
                    'ol-street-view--drop-target'
                );

                document.removeEventListener('mousemove', onMouseMove);
            };

            // Add Escape support to abort the dragging
            document.addEventListener('keydown', ({ key }) => {
                if (this._isDragging && key === 'Escape') {
                    stopInteract();
                    terminateDragging();
                    this.map.removeLayer(this._streetViewXyzLayer);
                }
            });

            interact('.ol-street-view--draggable')
                .draggable({
                    inertia: false,
                    onmove: (e) => {
                        this._isDragging = true;
                        stopInteract = e.interaction.stop;

                        document.addEventListener('mousemove', onMouseMove);

                        this.pegmanDraggable.classList.remove(
                            'ol-street-view--dropped'
                        );

                        const pTarget = e.target,
                            // Keep the Dragged Position in the data-x/data-y Attributes
                            x =
                                (parseFloat(pTarget.getAttribute('data-x')) ||
                                    0) + e.dx,
                            y =
                                (parseFloat(pTarget.getAttribute('data-y')) ||
                                    0) + e.dy;

                        // Translate the Element
                        pTarget.style.webkitTransform = pTarget.style.transform = `translate(${x}px, ${y}px)`;

                        // Update the Posiion Attributes
                        pTarget.setAttribute('data-x', x);
                        pTarget.setAttribute('data-y', y);
                    },
                    onend: (e) => {

                        // Compensate cursor offset
                        const location = this.map.getCoordinateFromPixel([
                            e.client.x - 25,
                            e.client.y + this.pegmanDraggable.clientHeight
                        ]);

                        this._pegmanSelectedCoords = location;
                        this._initPegmanOnMap();
                    }
                })
                .styleCursor(false);

            // Enable Draggables to be Dropped into this Container
            interact(this.viewport).dropzone({
                accept: '.ol-street-view--draggable',
                overlap: 0.75,
                ondropactivate: () => {
                    this.viewport.classList.add('ol-street-view--drop-active');
                },
                ondragenter: () => {
                    // Add Stree View Layer showing areas wheres StreetView exists
                    this.map.addLayer(this._streetViewXyzLayer);

                    document.body.classList.add(
                        'ol-street-view--activated-on-dragging'
                    );

                    this.pegmanDraggable.classList.add(
                        'ol-street-view--active',
                        'ol-street-view--can-drop'
                    );

                    this.viewport.classList.add('ol-street-view--drop-target');
                },
                ondragleave: () => {
                    // Remove the Drop Feedback Style
                    this.viewport.classList.remove(
                        'ol-street-view--drop-target'
                    );
                    this.pegmanDraggable.classList.remove(
                        'ol-street-view--can-drop'
                    );
                },
                ondrop: () => {
                    this.pegmanDraggable.classList.add(
                        'ol-street-view--dropped'
                    );
                },
                ondropdeactivate: () => terminateDragging()
            });
        };

        this.pegmanDivControl = document.createElement('div');
        this.pegmanDivControl.id = 'ol-street-view--pegman-button-div';

        this.pegmanDivControl.className = `ol-street-view--${this.options.size}-btn`;

        this.pegmanDivControl.title = this._i18n.dragToInit;

        this.pegmanDraggable = document.createElement('div');
        this.pegmanDraggable.id = 'ol-street-view--pegman-draggable';
        this.pegmanDraggable.className =
            'ol-street-view--draggable ol-street-view--drag-drop';

        const pegmanBtn = document.createElement('div');
        pegmanBtn.id = 'ol-street-view--pegman-button';

        this.pegmanDivControl.append(this.pegmanDraggable);
        this.pegmanDivControl.append(pegmanBtn);

        this.viewport.appendChild(this.pegmanDivControl);

        addPegmanInteraction();

        addStreetViewHtml();
    }

    /**
     * @protected
     */
    async _loadStreetView(): Promise<void> {
        const loader = new Loader(this.options.apiKey, {
            language: this.options.language
        });

        try {
            google = await loader.load();
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @protected
     */
    _updateStreetViewPosition(coords: Coordinate): void {
        const latLon = transform(
            coords,
            this.view.getProjection(),
            'EPSG:4326'
        ).reverse();

        const latLonGoogle = { lat: latLon[0], lng: latLon[1] };

        const streetViewService = new google.maps.StreetViewService();

        streetViewService.getPanoramaByLocation(
            latLonGoogle,
            SV_MAX_DISTANCE_METERS,
            (_, status) => {
                if (status === google.maps.StreetViewStatus.OK) {
                    this._panorama.setPosition(latLonGoogle);
                    this._panorama.setVisible(true);
                } else {
                    this._showNoDataMode();
                    this._updatePegmanPosition(
                        coords,
                        /** transform = */ false
                    );
                }
            }
        );
    }

    /**
     * @protected
     */
    _updatePegmanPosition(
        coords: Coordinate | google.maps.LatLng,
        isGoogleFormat = true
    ): void {
        // If the coordinates are in Google format, extract the values,
        // and convert the projection
        if (isGoogleFormat) {
            coords = transform(
                [
                    (coords as google.maps.LatLng).lng(),
                    (coords as google.maps.LatLng).lat()
                ],
                'EPSG:4326',
                this.view.getProjection()
            );
        }

        this._pegmanSelectedCoords = coords as Coordinate;

        (this._pegmanFeature.getGeometry() as Point).setCoordinates(
            this._pegmanSelectedCoords
        );

        this.view.animate({
            center: this._pegmanSelectedCoords,
            duration: 100
        });
    }

    /**
     * @protected
     */
    _initStreetView(): void {
        this._panorama = new google.maps.StreetViewPanorama(
            this.streetViewContainer,
            {
                pov: { heading: 165, pitch: 0 },
                zoom: 1,
                visible: false,
                motionTracking: false,
                motionTrackingControl: false,
                radius: SV_MAX_DISTANCE_METERS
            }
        );

        this._panorama.addListener('position_changed', () => {
            const position = this._panorama.getPosition();
            this._updatePegmanPosition(position);
        });

        this._panorama.addListener('pov_changed', () => {
            this._pegmanHeading = this._panorama.getPov().heading;
            this._pegmanLayer.getSource().changed();
        });

        const exitControlST = this.exitControlUI.cloneNode(true);
        (exitControlST as HTMLButtonElement).onclick = this.hideStreetView.bind(
            this
        );

        this._panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push(
            exitControlST
        );

        this._isInitialized = true;
    }

    /**
     * @protected
     */
    _initPegmanOnMap(): void {
        if (this._pegmanLayer.getSource().getFeatures().length) {
            return;
        }

        // Add Class to Body
        if (!document.body.classList.contains('ol-street-view--activated')) {
            document.body.classList.add('ol-street-view--activated');

            // Update Map Size
            this.map.updateSize();
        }

        this._selectPegman.getFeatures().clear();

        if (!Object.keys(this._pegmanSelectedCoords))
            this._pegmanSelectedCoords = this.view.getCenter();

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

    /**
     * @protected
     */
    _showNoDataMode(): void {
        this._panorama.setVisible(false);
    }

    /**
     * Map click listener to translate StreetView position
     *
     * @protected
     */
    _addClickListener(): void {
        const clickListener = (evt) => {
            const position = this.map.getCoordinateFromPixel(evt.pixel);
            this._updateStreetViewPosition(position);
            evt.preventDefault();
            evt.stopPropagation();
        };

        this._keyClickOnMap = this.map.on('click', clickListener);
    }

    /**
     * @public
     */
    showStreetView(): void {
        // Only init one time
        if (!this._isInitialized) {
            this._initStreetView();
        }

        this._updateStreetViewPosition(this._pegmanSelectedCoords);
        this._panorama.setVisible(true);
        this._addClickListener();
        this.viewport.dispatchEvent(this._streetViewInitEvt);
    }

    /**
     * @public
     */
    hideStreetView(): void {
        this._selectPegman.getFeatures().clear();

        const pegmanLayerSource = this._pegmanLayer.getSource();

        pegmanLayerSource.clear();

        this._pegmanSelectedCoords = [];

        // Remove SV Layer
        this.map.removeLayer(this._streetViewXyzLayer);

        document.body.classList.remove('ol-street-view--activated');

        // Force refresh the layers
        this.map.updateSize();
        window.dispatchEvent(new Event('resize'));

        this._panorama.setVisible(false);

        unByKey(this._keyClickOnMap);

        // Maybe, exit fullscreen
        if (document.fullscreenElement) document.exitFullscreen();

        this.viewport.dispatchEvent(this._streetViewExitEvt);
    }
}

interface i18n {
    exit: string;
    exitView: string;
    dragToInit: string;
    noImages: string;
    termsOfService: string;
}

interface Options {
    apiKey: string;
    size: 'sm' | 'md' | 'lg';
    language: 'es' | 'en';
}

export { Options, i18n };
