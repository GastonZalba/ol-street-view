import View from 'ol/View.js';
import Map from 'ol/Map.js';
import Feature from 'ol/Feature.js';
import Collection from 'ol/Collection.js';
import Icon from 'ol/style/Icon.js';
import Style from 'ol/style/Style.js';
import VectorSource from 'ol/source/Vector.js';
import XYZ from 'ol/source/XYZ.js';
import Point from 'ol/geom/Point.js';
import Control from 'ol/control/Control.js';
import BaseEvent from 'ol/events/Event.js';
import { MapBrowserEvent } from 'ol';
import { transform } from 'ol/proj.js';
import VectorLayer from 'ol/layer/Vector.js';
import TileLayer from 'ol/layer/Tile.js';
import Translate from 'ol/interaction/Translate.js';
import { Coordinate } from 'ol/coordinate.js';
import {
    CombinedOnSignature,
    EventTypes,
    OnSignature,
    unByKey
} from 'ol/Observable.js';
import { EventsKey } from 'ol/events.js';
import { TranslateEvent } from 'ol/interaction/Translate.js';
import { ObjectEvent } from 'ol/Object.js';
import { Types as ObjectEventTypes } from 'ol/ObjectEventType.js';

// External
import interact from 'interactjs';
import { Loader } from '@googlemaps/js-api-loader';

// Images
import pegmanMarkerSprites from './assets/images/pegman_marker.png';
import noImagesSvg from './assets/images/no_images.svg';

import * as languages from './components/i18n/index';

// Css
import './assets/scss/ol-street-view.scss';

let libraryLoaded = false;

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

    // Ol
    private _map: Map;
    private _view: View;
    private _viewport: HTMLElement;

    protected _isDragging: boolean;
    protected _isHidden: boolean;
    protected _onMouseMoveHandler: EventListener;
    protected _onKeyEventHandler: EventListener;

    // Control
    protected exitControlUI: HTMLButtonElement;
    protected pegmanDraggable: HTMLElement;
    protected pegmanDivControl: HTMLElement;
    protected _streetViewPanoramaEl: HTMLElement;
    protected mapContainer: HTMLElement;
    protected _sizeTogglerControl: Control;

    // Obserbable keys
    protected _clickOnMapEventKey: EventsKey;
    protected _translateEventKey: EventsKey;
    protected _viewResolutionEventKey: EventsKey;

    // Layers
    protected _streetViewXyzLayer: TileLayer<XYZ>;
    protected _addedXyzLayer = false;
    protected _pegmanLayer: VectorLayer<VectorSource>;

    protected _panorama: google.maps.StreetViewPanorama;
    protected _streetViewService: google.maps.StreetViewService;

    // Pegman
    protected _pegmanFeature: Feature<Point>;
    protected _pegmanSelectedCoords: Coordinate;
    protected _pegmanHeading: number;
    protected _translatePegman: Translate;

    // State
    protected _lastHeight: string;

    protected _isPositionFired: boolean;

    protected _initialized = false;

    protected _scrollHandlerEl: HTMLElement;

    protected _interactDropzone: Interact.Interactable;
    protected _interactDraggable: Interact.Interactable;
    protected _interactResizable: Interact.Interactable;
    protected _interactStop: () => void;

    public googleMapsLoader: Loader;

    declare on: OnSignature<
        EventTypes | `${SVEventTypes}`,
        BaseEvent,
        EventsKey
    > &
        OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> &
        CombinedOnSignature<
            `${SVEventTypes}` | ObjectEventTypes | EventTypes,
            EventsKey
        >;

    declare once: OnSignature<
        EventTypes | `${SVEventTypes}`,
        BaseEvent,
        EventsKey
    > &
        OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> &
        CombinedOnSignature<
            `${SVEventTypes}` | ObjectEventTypes | EventTypes,
            EventsKey
        >;

    declare un: OnSignature<EventTypes | `${SVEventTypes}`, BaseEvent, void> &
        OnSignature<ObjectEventTypes, ObjectEvent, void> &
        CombinedOnSignature<
            `${SVEventTypes}` | ObjectEventTypes | EventTypes,
            void
        >;

    constructor(opt_options?: Options) {
        super({
            element: document.createElement('div'),
            target: opt_options.target
        });

        // Default options
        this._options = {
            apiKey: null,
            size: BtnControlSize.Large,
            radius: 100,
            updatePegmanToClosestPanorama: true,
            transparentButton: false,
            resizable: true,
            sizeToggler: true,
            defaultMapSize: MapSize.Expanded,
            language: Language.EN,
            target: null,
            zoomOnInit: 18,
            minZoom: null,
            autoLoadGoogleMaps: true,
            ...opt_options // Merge user options
        };

        // If language selector is provided and translation exists...
        this._i18n =
            languages[
                this._options.language in languages
                    ? this._options.language
                    : 'en'
            ];

        // Merge custom translations
        this._i18n = Object.assign(this._i18n, opt_options.i18n || {});

        this._pegmanSelectedCoords = [];
        this._pegmanHeading = 180;

        if (this._options.autoLoadGoogleMaps) {
            this.once(SVEventTypes.LOAD_LIB, () => {
                libraryLoaded = true;
                this.init();
            });

            this._loadStreetView();
        }

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
                attributions: `&copy; ${new Date().getFullYear()} Google Maps <a href="https://www.google.com/help/terms_maps/" target="_blank">${
                    this._i18n.termsOfService
                }</a>`,
                maxZoom: 19,
                url: 'https://mt{0-3}.google.com/vt/?lyrs=svv|cb_client:apiv3&style=50&x={x}&y={y}&z={z}'
            })
        });

        // Pegman Layer
        this._pegmanLayer = new VectorLayer({
            zIndex: 99,
            source: new VectorSource(),
            style: () =>
                new Style({
                    image: new Icon({
                        anchor: [0.5, 32],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        rotateWithView: true,
                        opacity: 1.0,
                        src: pegmanMarkerSprites as string,
                        size: [48, 48],
                        offset: calculatePegmanIconOffset()
                    })
                })
        });
    }

    /**
     * Only use this method if `autoLoadGoogleMaps` is `false`. Call it after the Google Maps library is loaded.
     * Otherwise it will called automatically after the Maps Library is loaded.
     */
    public init(): void {
        if (!this._map) return;

        this._streetViewService = new google.maps.StreetViewService();
        this._panorama = new google.maps.StreetViewPanorama(
            this._streetViewPanoramaEl as HTMLElement,
            {
                pov: { heading: 165, pitch: 0 },
                zoom: 1,
                visible: false,
                motionTracking: false,
                motionTrackingControl: false,
                enableCloseButton: false,
                fullscreenControl: false
            }
        );

        this._panorama.addListener('position_changed', () => {
            if (this._isPositionFired) {
                return;
            }

            setTimeout(() => {
                this._isPositionFired = null;
            }, 400);

            this._isPositionFired = true;

            const position = this._panorama.getPosition();
            this._updatePegmanPosition(position, true);
        });

        this._panorama.addListener('pov_changed', () => {
            const heading = this._panorama.getPov().heading;
            // Add this check to prevent firing multiple times
            if (heading !== this._pegmanHeading) {
                this._pegmanHeading = heading;
                this._pegmanLayer.getSource().changed();
            }
        });

        const exitControlST = this.exitControlUI.cloneNode(true) as HTMLElement;
        (exitControlST as HTMLButtonElement).onclick =
            this.hideStreetView.bind(this);

        this._panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push(
            exitControlST
        );

        if (!this._interactDraggable) {
            this._addPegmanInteraction();
        }

        this._initialized = true;
    }

    /**
     * Remove the control from its current map and attach it to the new map.
     * Pass null to just remove the control from the current map.
     * @param map
     */
    public setMap(map: Map): void {
        super.setMap(map);

        if (map) {
            if (this._map) return;

            this._map = super.getMap();
            this._view = this._map.getView();
            this._viewport = this._map.getTargetElement();

            this._map.addLayer(this._pegmanLayer);

            this._prepareLayout();

            this._addMapControls();

            if (libraryLoaded && !this._initialized) {
                this.init();
            }

            if (this._options.minZoom) {
                this._maybeHideControl();
                this._viewResolutionEventKey = this._view.on(
                    'change:resolution',
                    () => this._maybeHideControl()
                );
            }
        } else {
            if (!this._map) return;

            this._removeLayout();

            this._sizeTogglerControl.setMap(null);
            this.element.remove();
            this.hideStreetView();
            this._map.removeLayer(this._pegmanLayer);

            // remove all interact
            this._interactDraggable.unset();
            this._interactDropzone.unset();
            this._interactResizable.unset();

            this._removeKeyboardEvents();

            if (this._viewResolutionEventKey) {
                unByKey(this._viewResolutionEventKey);
            }

            this._initialized = false;
            this._map = null;
        }
    }

    /**
     * Show or hide the control depending on the zoom level
     */
    private _maybeHideControl(): void {
        const zoom = this._view.getZoom();
        if (zoom <= this._options.minZoom) {
            if (this._isHidden) this._showControl(true);
        } else {
            if (!this._isHidden) this._showControl(false);
        }
    }

    /**
     * @param bool
     */
    private _showControl(bool: boolean): void {
        const CLASS_HIDE_CONTROL = 'ol-street-view--hide-control';
        if (bool) this.element.classList.add(CLASS_HIDE_CONTROL);
        else this.element.classList.remove(CLASS_HIDE_CONTROL);

        this._isHidden = !bool;
    }

    private _addTranslateInteraction(): void {
        if (this._translatePegman) {
            return this._translatePegman.setActive(true);
        }

        this._translatePegman = new Translate({
            features: new Collection([this._pegmanFeature])
        });

        this._addTranslateInteractionEvent();

        this._map.addInteraction(this._translatePegman);
    }

    private _addTranslateInteractionEvent(): void {
        const translatePegmanHandler = (evt: TranslateEvent): void => {
            this._pegmanSelectedCoords = evt.coordinate;
            this._updateStreetViewPosition(this._pegmanSelectedCoords);
        };
        this._translateEventKey = this._translatePegman.on(
            'translateend',
            translatePegmanHandler
        );
    }

    private _remvoveTranslateInteractionEvent(): void {
        unByKey(this._translateEventKey);
    }

    private _prepareLayout(): void {
        /**
         * Create a handler to allow resize the layout
         *
         * @protected
         */
        const addHandlerResizable = (): void => {
            this._scrollHandlerEl = document.createElement('div');
            this._scrollHandlerEl.className = 'ol-street-view--scroll-handler';
            this._scrollHandlerEl.innerHTML = '<span></span>';
            this._viewport.append(this._scrollHandlerEl);

            const debounceRefresh = debounce(() => {
                this._refreshMap(false);
            }, 150);

            this._interactResizable = interact(this._viewport).resizable({
                edges: {
                    top: this._scrollHandlerEl,
                    left: false,
                    bottom: false,
                    right: false
                },
                onstart: () => {
                    // If not removed, the resize is very janky
                    this.mapContainer.classList.remove(
                        'ol-street-view--transitions'
                    );
                },
                onmove: (evt) => {
                    let { y } = evt.target.dataset;
                    y = (parseFloat(y) || 0) + evt.deltaRect.top;

                    Object.assign(evt.target.style, {
                        height: `${Math.round(evt.rect.height)}px`
                    });

                    Object.assign(evt.target.dataset, { y });

                    debounceRefresh();
                },
                onend: () => {
                    this.mapContainer.classList.add(
                        'ol-street-view--transitions'
                    );
                    this._refreshMap(false);
                },
                modifiers: [
                    interact.modifiers.restrictSize({
                        min: { width: null, height: 200 }
                    })
                ]
            });
        };

        /**
         * Create the streView container
         * and move the map inside another parent container
         *
         * @protected
         */
        const addStreetViewHtml = (): void => {
            this._streetViewPanoramaEl = document.createElement('div');
            this._streetViewPanoramaEl.id = 'ol-street-view--panorama';

            const streetViewNoResultsDiv = document.createElement('div');
            streetViewNoResultsDiv.className = 'ol-street-view--no-results';
            streetViewNoResultsDiv.innerHTML = `
            <div class="ol-street-view--no-results-icon">
                <img src="${noImagesSvg}"/>
            </div>
            <div class="ol-street-view--no-results-text">
                ${this._i18n.noImages}
            </div>
        `;
            this._streetViewPanoramaEl.appendChild(streetViewNoResultsDiv);

            // Create exit control div
            this.exitControlUI = document.createElement('button');
            this.exitControlUI.innerHTML = this._i18n.exit;
            this.exitControlUI.type = 'button';
            this.exitControlUI.className = 'gm-control-active gm-control-exit';
            this.exitControlUI.title = this._i18n.exitView;
            //this.exitControlUI.index = 1;
            this.exitControlUI.onclick = this.hideStreetView.bind(this);

            streetViewNoResultsDiv.appendChild(this.exitControlUI);

            const parentMap = this._viewport.parentElement;

            this.mapContainer = document.createElement('div');
            this.mapContainer.id = 'ol-street-view--map-container';
            this.mapContainer.className = 'ol-street-view--transitions';

            // Move the map element (viewport) inside a new container
            parentMap.replaceChild(this.mapContainer, this._viewport);

            this.mapContainer.appendChild(this._streetViewPanoramaEl);
            this.mapContainer.appendChild(this._viewport);

            this._viewport.classList.add('ol-street-view--map');

            if (this._options.resizable) {
                addHandlerResizable();
            }
        };

        addStreetViewHtml();
    }

    private _removeLayout(): void {
        this._scrollHandlerEl.remove();
        this._streetViewPanoramaEl.remove();

        const parentMap = this.mapContainer.parentElement;
        parentMap.appendChild(this._viewport);
        this._viewport.classList.remove('ol-street-view--map');
        this.mapContainer.remove();
    }

    private _addMouseMoveEvents(): void {
        let oldPosX = 0;

        if (!this._onMouseMoveHandler) {
            // Grab Left/Right Direction of Mouse for Pegman Image
            let onMouseMove: EventListener = (e: MouseEvent | TouchEvent) => {
                const pageX =
                    'changedTouches' in e ? e.changedTouches[0].pageX : e.pageX;

                // Left
                if (pageX < oldPosX) {
                    this.pegmanDraggable.classList.add('ol-street-view--left');
                    this.pegmanDraggable.classList.remove(
                        'ol-street-view--right'
                    );

                    // Right
                } else if (pageX > oldPosX) {
                    this.pegmanDraggable.classList.add('ol-street-view--right');
                    this.pegmanDraggable.classList.remove(
                        'ol-street-view--left'
                    );
                }

                oldPosX = pageX;

                return oldPosX;
            };
            this._onMouseMoveHandler = onMouseMove.bind(this);
        }

        document.addEventListener('mousemove', this._onMouseMoveHandler);
        document.addEventListener('touchmove', this._onMouseMoveHandler);
    }

    private _removeMouseMoveEvents(): void {
        document.removeEventListener('mousemove', this._onMouseMoveHandler);
        document.removeEventListener('touchmove', this._onMouseMoveHandler);
    }

    private _addKeyboardEvents(): void {
        if (!this._onKeyEventHandler) {
            const keyEventHandler = ({ key }) => {
                if (key === 'Escape') {
                    if (this._isDragging && this._interactStop) {
                        this._interactStop();
                        this._interactStop = null;
                        this._terminateDragging();
                        this._removeStreetViewXyzLayer();
                    } else {
                        this.hideStreetView();
                    }
                }
            };
            this._onKeyEventHandler = keyEventHandler.bind(this);
        }

        // Add Escape support to abort the dragging or exit the panorama view
        document.addEventListener('keydown', this._onKeyEventHandler);
    }

    private _removeKeyboardEvents(): void {
        document.removeEventListener('keydown', this._onKeyEventHandler);
    }

    private _terminateDragging(): void {
        this._isDragging = false;

        this.element.classList.remove('ol-street-view--activated-on-dragging');

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
        this._viewport.classList.remove(
            'ol-street-view--drop-active',
            'ol-street-view--drop-target'
        );

        this._removeMouseMoveEvents();
    }

    private _addPegmanInteraction(): void {
        this.pegmanDivControl.title = this._i18n.dragToInit;
        this.pegmanDivControl.classList.remove('ol-street-view--disabled');

        this._addKeyboardEvents();
        this._interactDraggable = interact('.ol-street-view--draggable')
            .draggable({
                inertia: false,
                onstart: (e) => {
                    // Always center pegman on the cursor,
                    // even if the drag start on the control border
                    const pTarget = e.target;

                    // Get the button width
                    const w = pTarget.offsetWidth;

                    // Get the button x middle position
                    const x = pTarget.getBoundingClientRect().left + w / 2;

                    // Update the Position Attributes
                    pTarget.setAttribute('data-x', -(x - e.x0));
                },
                onmove: (e) => {
                    this._isDragging = true;
                    this._interactStop = e.interaction.stop;

                    this._addMouseMoveEvents();

                    this.pegmanDraggable.classList.remove(
                        'ol-street-view--dropped'
                    );

                    const pTarget = e.target,
                        // Keep the Dragged Position in the data-x/data-y Attributes
                        x =
                            (parseFloat(pTarget.getAttribute('data-x')) || 0) +
                            e.dx,
                        y =
                            (parseFloat(pTarget.getAttribute('data-y')) || 0) +
                            e.dy;

                    // Translate the Element
                    pTarget.style.webkitTransform =
                        pTarget.style.transform = `translate(${x}px, ${y}px)`;

                    // Update the Position Attributes
                    pTarget.setAttribute('data-x', x);
                    pTarget.setAttribute('data-y', y);
                },
                onend: (e) => {
                    const viewportOffset =
                        this.mapContainer.getBoundingClientRect();

                    // To compensate if the map is not 100%  width of the browser
                    const mapDistanceX = viewportOffset.left;
                    const mapDistanceY = viewportOffset.top;

                    // Compensate cursor offset
                    const location = this._map.getCoordinateFromPixel([
                        e.client.x - mapDistanceX,
                        e.client.y -
                            mapDistanceY +
                            this.pegmanDraggable.clientHeight -
                            10
                    ]);

                    this._pegmanSelectedCoords = location;
                    this._initPegmanOnMap();
                }
            })
            .styleCursor(false);

        // Enable Draggables to be Dropped into this Container
        this._interactDropzone = interact(this._viewport).dropzone({
            accept: '.ol-street-view--draggable',
            overlap: 0.75,
            ondropactivate: () => {
                this._viewport.classList.add('ol-street-view--drop-active');
            },
            ondragenter: () => {
                this._addStreetViewXyzLayer();

                this.element.classList.add(
                    'ol-street-view--activated-on-dragging'
                );

                this.pegmanDraggable.classList.add(
                    'ol-street-view--active',
                    'ol-street-view--can-drop'
                );

                this._viewport.classList.add('ol-street-view--drop-target');
            },
            ondragleave: () => {
                // Remove the Drop Feedback Style
                this._viewport.classList.remove('ol-street-view--drop-target');
                this.pegmanDraggable.classList.remove(
                    'ol-street-view--can-drop'
                );
            },
            ondrop: () => {
                this.pegmanDraggable.classList.add('ol-street-view--dropped');
            },
            ondropdeactivate: () => this._terminateDragging()
        });
    }

    private _addMapControls(): void {
        const preparePegmanControl = (): HTMLElement => {
            this.pegmanDivControl = this.element;
            this.pegmanDivControl.id = 'ol-street-view--pegman-button-div';
            this.pegmanDivControl.className = `ol-street-view--${
                this._options.size
            }-btn ol-control ol-street-view--disabled ${
                this._options.transparentButton
                    ? 'ol-street-view--transparent'
                    : ''
            }`;
            this.pegmanDivControl.title = this._i18n.googleMapsLibraryError;

            this.pegmanDraggable = document.createElement('div');
            this.pegmanDraggable.id = 'ol-street-view--pegman-draggable';
            this.pegmanDraggable.className =
                'ol-street-view--draggable ol-street-view--drag-drop';

            const pegmanBtn = document.createElement('div');
            pegmanBtn.id = 'ol-street-view--pegman-button';

            this.pegmanDivControl.append(this.pegmanDraggable);
            this.pegmanDivControl.append(pegmanBtn);

            return this.pegmanDivControl;
        };

        /**
         * Secondary map control to allow toggle the size of the map
         * when the panorama is active
         */
        const getSizeTogglerControl = (): Control => {
            const CLASS_COMPACT = 'ol-street-view--compact';
            const CLASS_HIDDEN = 'ol-street-view--hidden';

            if (this._options.defaultMapSize === 'compact') {
                this.mapContainer.classList.add(CLASS_COMPACT);
            } else if (this._options.defaultMapSize === 'hidden') {
                this.mapContainer.classList.add(CLASS_HIDDEN);
            }

            const togglerDiv = document.createElement('div');
            togglerDiv.className =
                'ol-street-view--size-toggler ol-unselectable ol-control';

            const togglerBtn = document.createElement('button');
            togglerBtn.title = this._i18n.minimize;
            togglerBtn.innerHTML =
                '<div class="ol-street-view--size-toggler-img"></div>';
            togglerBtn.onclick = () => {
                const toggle =
                    this.mapContainer.classList.toggle(CLASS_COMPACT);

                if (toggle) {
                    // Minimized
                    togglerBtn.title = this._i18n.expand;
                    // Store height for later
                    this._lastHeight = this._viewport.style.height;
                    // Restore height if it was resized
                    this._viewport.style.height = null;
                } else {
                    // Expanded
                    togglerBtn.title = this._i18n.minimize;
                    if (this._lastHeight)
                        this._viewport.style.height = this._lastHeight;
                }

                // Timeout to allow transition in ccs
                setTimeout(() => {
                    this._refreshMap();
                }, 150);
            };

            togglerDiv.append(togglerBtn);

            return new Control({
                element: togglerDiv
            });
        };

        if (!this.element.id) {
            preparePegmanControl();
        }

        if (this._options.sizeToggler) {
            // run only once
            if (!this._sizeTogglerControl) {
                this._sizeTogglerControl = getSizeTogglerControl();
            }

            this._map.addControl(this._sizeTogglerControl);
        }

        if (libraryLoaded) {
            this._addPegmanInteraction();
        }
    }

    /**
     * @fires load
     */
    private async _loadStreetView(): Promise<void> {
        if (libraryLoaded) return;

        this.googleMapsLoader = new Loader({
            apiKey: this._options.apiKey,
            version: 'weekly',
            language: this._options.language
        });

        this.googleMapsLoader
            .importLibrary('maps')
            .then(() => {
                super.dispatchEvent(SVEventTypes.LOAD_LIB);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    private _updateStreetViewPosition(coords: Coordinate): void {
        const latLon = transform(
            coords,
            this._view.getProjection(),
            'EPSG:4326'
        ).reverse();

        const latLonGoogle = { lat: latLon[0], lng: latLon[1] };

        //@ts-ignore-error this method is missing in the @types
        this._streetViewService.getPanoramaByLocation(
            latLonGoogle,
            this._options.radius,
            (streetViewPanoramaData, status) => {
                if (status === google.maps.StreetViewStatus.OK) {
                    this._panorama.setPosition(latLonGoogle);
                    this._panorama.setVisible(true);
                    this._panorama.setZoom(1);
                    if (this._options.updatePegmanToClosestPanorama) {
                        this._remvoveTranslateInteractionEvent();
                        this._updatePegmanPosition(
                            streetViewPanoramaData.location.latLng,
                            true
                        );
                        this._addTranslateInteractionEvent();
                    }
                } else {
                    this._showNoDataMode();
                    this._updatePegmanPosition(coords, false);
                }
            }
        );
    }

    private _updatePegmanPosition(
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
                this._view.getProjection()
            );
        }

        this._pegmanSelectedCoords = coords as Coordinate;

        this._pegmanFeature
            .getGeometry()
            .setCoordinates(this._pegmanSelectedCoords);

        this._centerMapToPegman();
    }

    private _centerMapToPegman(): void {
        this._view.animate({
            center: this._pegmanSelectedCoords,
            duration: 100
        });
    }

    private _initPegmanOnMap(): void {
        if (this._pegmanLayer.getSource().getFeatures().length) {
            return;
        }

        // Add Class to container
        if (
            !this.mapContainer.classList.contains('ol-street-view--activated')
        ) {
            this.mapContainer.classList.add('ol-street-view--activated');

            // Update Map Size
            this._map.updateSize();
        }

        this.element.classList.add('ol-street-view--activated');

        if (!Object.keys(this._pegmanSelectedCoords))
            this._pegmanSelectedCoords = this._view.getCenter();

        if (!this._pegmanFeature) {
            this._pegmanFeature = new Feature({
                name: 'Pegman',
                geometry: new Point(this._pegmanSelectedCoords)
            });
        } else {
            this._pegmanFeature
                .getGeometry()
                .setCoordinates(this._pegmanSelectedCoords);
        }

        this._pegmanLayer.getSource().addFeature(this._pegmanFeature);

        this._addTranslateInteraction();

        this._view.setCenter(this._pegmanSelectedCoords);
        this._view.setZoom(this._options.zoomOnInit);
        this._showStreetView(this._pegmanSelectedCoords);
    }

    private _showNoDataMode(): void {
        this._panorama.setVisible(false);
    }

    /**
     * Map click listener to translate StreetView position
     */
    private _addClickListener(): void {
        const clickListener = (evt: MapBrowserEvent<PointerEvent>) => {
            this._updateStreetViewPosition(evt.coordinate);
            evt.preventDefault();
            evt.stopPropagation();
        };

        this._clickOnMapEventKey = this._map.on('click', clickListener);
    }

    private _refreshMap(centerToPegman = true): void {
        if (!this._map) return;

        // Force refresh the layers
        this._map.updateSize();
        window.dispatchEvent(new Event('resize'));

        if (centerToPegman) this._centerMapToPegman();
    }

    /**
     * Show Street View mode
     * @param coords Must be in the map projection format
     * @fires streetViewInit
     */
    private _showStreetView(coords: Coordinate): void {
        if (this._lastHeight) {
            this._viewport.style.height = this._lastHeight;
        }

        // Timeout to allow transition in ccs
        setTimeout(() => {
            this._refreshMap(false);
        }, 150);

        this._updateStreetViewPosition(coords);
        this._panorama.setVisible(true);
        this._addClickListener();
        super.dispatchEvent(SVEventTypes.STREET_VIEW_INIT);
    }

    /**
     * Add Stree View Layer showing areas wheres StreetView exists
     */
    private _addStreetViewXyzLayer(): void {
        if (!this._addedXyzLayer) this._map.addLayer(this._streetViewXyzLayer);
        this._addedXyzLayer = true;
    }

    private _removeStreetViewXyzLayer(): void {
        this._map.removeLayer(this._streetViewXyzLayer);
        this._addedXyzLayer = false;
    }
    /**
     * This is useful if wou wanna add a custom icon on the panorama instance,
     * add custom listeners, etc
     * @returns {google.maps.StreetViewPanorama}
     */
    public getStreetViewPanorama(): google.maps.StreetViewPanorama {
        return this._panorama;
    }

    /**
     * Get the Vector Layer in wich Pegman is displayed
     * @returns {VectorLayer<VectorSource>}
     */
    public getPegmanLayer(): VectorLayer<VectorSource> {
        return this._pegmanLayer;
    }

    /**
     * Get the background Raster layer that displays the existing zones with Street View available
     * @returns {TileLayer<XYZ>}
     */
    public getStreetViewLayer(): TileLayer<XYZ> {
        return this._streetViewXyzLayer;
    }

    /**
     * Show Street View mode
     * @fires streetViewInit
     * @param {Coordinate} coords Must be in the map projection format
     * @returns {google.maps.StreetViewPanorama}
     */
    public showStreetView(coords: Coordinate): google.maps.StreetViewPanorama {
        if (!coords) {
            console.error('Coords are empty');
            return;
        }

        this._addStreetViewXyzLayer();

        this._view.setCenter(coords);
        this._view.setZoom(18);

        this._pegmanSelectedCoords = coords;

        this._initPegmanOnMap();

        return this.getStreetViewPanorama();
    }

    /**
     * Hide Street View, remove layers and clear features
     * @fires streetViewExit
     */
    public hideStreetView(): void {
        this._translatePegman.setActive(false);

        const pegmanLayerSource = this._pegmanLayer.getSource();

        pegmanLayerSource.clear();

        this._pegmanSelectedCoords = [];

        // Remove SV Layer
        this._removeStreetViewXyzLayer();

        this.mapContainer.classList.remove('ol-street-view--activated');
        this.element.classList.remove('ol-street-view--activated');

        // Store height for later
        this._lastHeight = this._viewport.style.height;

        // Restore height if it was resized
        this._viewport.style.height = null;

        this._panorama.setVisible(false);

        setTimeout(() => {
            this._refreshMap(false);
        }, 150);

        unByKey(this._clickOnMapEventKey);

        // Maybe, exit fullscreen
        if (document.fullscreenElement) document.exitFullscreen();

        super.dispatchEvent(SVEventTypes.STREET_VIEW_EXIT);
    }
}

/**
 * https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086
 *
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * `wait` milliseconds.
 * @protected
 * @param func
 * @param wait
 */
function debounce(func, wait = 250) {
    let timeout: ReturnType<typeof setTimeout>;

    return function executedFunction(...args): void {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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
enum SVEventTypes {
    LOAD_LIB = 'loadLib',
    STREET_VIEW_INIT = 'streetViewInit',
    STREET_VIEW_EXIT = 'streetViewExit'
}

/**
 * @public
 */
enum Language {
    ES = 'es',
    EN = 'en'
}

/**
 * @public
 */
enum BtnControlSize {
    Small = 'sm',
    Medium = 'md',
    Large = 'lg'
}

/**
 * @public
 */
enum MapSize {
    Expanded = 'expanded',
    Compact = 'compact',
    Hidden = 'hidden'
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
