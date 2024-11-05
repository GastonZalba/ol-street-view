
/*!
 * ol-street-view - v3.0.0
 * https://github.com/GastonZalba/ol-street-view#readme
 * Built: Tue Nov 05 2024 14:37:37 GMT-0300 (hora estándar de Argentina)
*/
import Feature from 'ol/Feature.js';
import Collection from 'ol/Collection.js';
import Icon from 'ol/style/Icon.js';
import Style from 'ol/style/Style.js';
import VectorSource from 'ol/source/Vector.js';
import XYZ from 'ol/source/XYZ.js';
import Point from 'ol/geom/Point.js';
import Control from 'ol/control/Control.js';
import { transform } from 'ol/proj.js';
import VectorLayer from 'ol/layer/Vector.js';
import TileLayer from 'ol/layer/Tile.js';
import Translate from 'ol/interaction/Translate.js';
import { unByKey } from 'ol/Observable.js';
import interact from 'interactjs';
import { Loader } from '@googlemaps/js-api-loader';

var img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAANDCAYAAADrXJx1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTAyLTE1VDIwOjA2OjIyLTAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wMi0yMFQxMjo1Nzo0My0wMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wMi0yMFQxMjo1Nzo0My0wMzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0ZDc1NDk5OC04ZjllLTU5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";

var img = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath fill='white' d='M379.5 288h4.5q39 0 67.5 28.5t28.5 67.5v6zM241.5 313.5q-18 36-18 70.5 0 66 47.25 113.25t113.25 47.25q34.5 0 70.5-18l-49.5-49.5q-12 3-21 3-39 0-67.5-28.5t-28.5-67.5q0-9 3-21zM64.5 136.5l40.5-40.5 567 567-40.5 40.5q-7.5-7.5-47.25-46.5t-60.75-60q-64.5 27-139.5 27-118.5 0-214.5-66t-138-174q16.5-39 51.75-86.25t68.25-72.75q-18-18-50.25-51t-36.75-37.5zM384 223.5q-30 0-58.5 12l-69-69q58.5-22.5 127.5-22.5 118.5 0 213.75 66t137.25 174q-36 88.5-109.5 151.5l-93-93q12-28.5 12-58.5 0-66-47.25-113.25t-113.25-47.25z'%3e%3c/path%3e%3c/svg%3e";

const es = {
    exit: 'Salir',
    exitView: 'Salir de la vista Street View',
    dragToInit: 'Arrastre y suelte para iniciar Google Street View',
    googleMapsLibraryError: 'Librería Google Maps no está cargada',
    noImages: 'Sin imágenes en la zona. Click en el mapa para trasladarse',
    termsOfService: 'Condiciones del Servicio',
    expand: 'Expandir',
    minimize: 'Minimizar'
};

const en = {
    exit: 'Exit',
    exitView: 'Exit Street View mode',
    dragToInit: 'Drag and drop to initialize Google Street View',
    googleMapsLibraryError: 'Google Maps Library is not loaded',
    noImages: 'No images found. Click on the map to move',
    termsOfService: 'Terms of Service',
    expand: 'Expand',
    minimize: 'Minimize'
};

var languages = /*#__PURE__*/Object.freeze({
  __proto__: null,
  en: en,
  es: es
});

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
class StreetView extends Control {
    constructor(opt_options) {
        super({
            element: document.createElement('div'),
            target: opt_options.target
        });
        this._addedXyzLayer = false;
        this._initialized = false;
        // Default options
        this._options = Object.assign({ apiKey: null, size: BtnControlSize.Large, radius: 100, updatePegmanToClosestPanorama: true, transparentButton: false, resizable: true, sizeToggler: true, defaultMapSize: MapSize.Expanded, language: Language.EN, target: null, zoomOnInit: 18, minZoom: null, autoLoadGoogleMaps: true }, opt_options // Merge user options
        );
        // If language selector is provided and translation exists...
        this._i18n =
            languages[this._options.language in languages
                ? this._options.language
                : 'en'];
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
        const calculatePegmanIconOffset = () => {
            const heading = this._pegmanHeading;
            let offset;
            // Calculating the sprite offset
            if (heading >= 0 && heading < 22.5) {
                offset = [0, 0];
            }
            else if (heading >= 22.5 && heading < 45) {
                offset = [0, 52];
            }
            else if (heading >= 45 && heading < 67.5) {
                offset = [0, 104];
            }
            else if (heading >= 67.5 && heading < 90) {
                offset = [0, 156];
            }
            else if (heading >= 90 && heading < 112.5) {
                offset = [0, 208];
            }
            else if (heading >= 112.5 && heading < 135) {
                offset = [0, 260];
            }
            else if (heading >= 135 && heading < 157.5) {
                offset = [0, 312];
            }
            else if (heading >= 157.5 && heading < 180) {
                offset = [0, 364];
            }
            else if (heading >= 180 && heading < 205.5) {
                offset = [0, 416];
            }
            else if (heading >= 205.5 && heading < 225) {
                offset = [0, 468];
            }
            else if (heading >= 225 && heading < 247.5) {
                offset = [0, 520];
            }
            else if (heading >= 247.5 && heading < 270) {
                offset = [0, 572];
            }
            else if (heading >= 270 && heading < 292.5) {
                offset = [0, 624];
            }
            else if (heading >= 292.5 && heading < 315) {
                offset = [0, 676];
            }
            else if (heading >= 315 && heading < 337.5) {
                offset = [0, 728];
            }
            else if (heading >= 337.5) {
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
                url: 'https://mt{0-3}.google.com/vt/?lyrs=svv|cb_client:apiv3&style=50&x={x}&y={y}&z={z}'
            })
        });
        // Pegman Layer
        this._pegmanLayer = new VectorLayer({
            zIndex: 99,
            source: new VectorSource(),
            style: () => new Style({
                image: new Icon({
                    anchor: [0.5, 32],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    rotateWithView: true,
                    opacity: 1.0,
                    src: img$1,
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
    init() {
        if (!this._map)
            return;
        this._streetViewService = new google.maps.StreetViewService();
        this._panorama = new google.maps.StreetViewPanorama(this._streetViewPanoramaEl, {
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
            visible: false,
            motionTracking: false,
            motionTrackingControl: false,
            enableCloseButton: false,
            fullscreenControl: false
        });
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
        const exitControlST = this.exitControlUI.cloneNode(true);
        exitControlST.onclick =
            this.hideStreetView.bind(this);
        this._panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push(exitControlST);
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
    setMap(map) {
        super.setMap(map);
        if (map) {
            if (this._map)
                return;
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
                this._viewResolutionEventKey = this._view.on('change:resolution', () => this._maybeHideControl());
            }
        }
        else {
            if (!this._map)
                return;
            this._removeLayout();
            this._sizeTogglerControl.setMap(null);
            this.element.remove();
            this.hideStreetView();
            this._map.removeLayer(this._pegmanLayer);
            // remove all interact
            this._interactDraggable.unset();
            this._interactDropzone.unset();
            this._interactResizable.unset();
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
    _maybeHideControl() {
        const zoom = this._view.getZoom();
        if (zoom <= this._options.minZoom) {
            if (this._isHidden)
                this._showControl(true);
        }
        else {
            if (!this._isHidden)
                this._showControl(false);
        }
    }
    /**
     * @param bool
     */
    _showControl(bool) {
        const CLASS_HIDE_CONTROL = 'ol-street-view--hide-control';
        if (bool)
            this.element.classList.add(CLASS_HIDE_CONTROL);
        else
            this.element.classList.remove(CLASS_HIDE_CONTROL);
        this._isHidden = !bool;
    }
    _addTranslateInteraction() {
        if (this._translatePegman) {
            return this._translatePegman.setActive(true);
        }
        this._translatePegman = new Translate({
            features: new Collection([this._pegmanFeature])
        });
        this._addTranslateInteractionEvent();
        this._map.addInteraction(this._translatePegman);
    }
    _addTranslateInteractionEvent() {
        const translatePegmanHandler = (evt) => {
            this._pegmanSelectedCoords = evt.coordinate;
            this._updateStreetViewPosition(this._pegmanSelectedCoords);
        };
        this._translateEventKey = this._translatePegman.on('translateend', translatePegmanHandler);
    }
    _remvoveTranslateInteractionEvent() {
        unByKey(this._translateEventKey);
    }
    _prepareLayout() {
        /**
         * Create a handler to allow resize the layout
         *
         * @protected
         */
        const addHandlerResizable = () => {
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
                    this.mapContainer.classList.remove('ol-street-view--transitions');
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
                    this.mapContainer.classList.add('ol-street-view--transitions');
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
        const addStreetViewHtml = () => {
            this._streetViewPanoramaEl = document.createElement('div');
            this._streetViewPanoramaEl.id = 'ol-street-view--panorama';
            const streetViewNoResultsDiv = document.createElement('div');
            streetViewNoResultsDiv.className = 'ol-street-view--no-results';
            streetViewNoResultsDiv.innerHTML = `
            <div class="ol-street-view--no-results-icon">
                <img src="${img}"/>
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
    _removeLayout() {
        this._scrollHandlerEl.remove();
        this._streetViewPanoramaEl.remove();
        const parentMap = this.mapContainer.parentElement;
        parentMap.appendChild(this._viewport);
        this._viewport.classList.remove('ol-street-view--map');
        this.mapContainer.remove();
    }
    _addPegmanInteraction() {
        this.pegmanDivControl.title = this._i18n.dragToInit;
        this.pegmanDivControl.classList.remove('ol-street-view--disabled');
        let oldPosX = 0, stopInteract;
        // Grab Left/Right Direction of Mouse for Pegman Image
        let onMouseMove = (e) => {
            const pageX = 'changedTouches' in e ? e.changedTouches[0].pageX : e.pageX;
            // Left
            if (pageX < oldPosX) {
                this.pegmanDraggable.classList.add('ol-street-view--left');
                this.pegmanDraggable.classList.remove('ol-street-view--right');
                // Right
            }
            else if (pageX > oldPosX) {
                this.pegmanDraggable.classList.add('ol-street-view--right');
                this.pegmanDraggable.classList.remove('ol-street-view--left');
            }
            oldPosX = pageX;
            return oldPosX;
        };
        onMouseMove = onMouseMove.bind(this);
        /**
         * @protected
         */
        const terminateDragging = () => {
            this._isDragging = false;
            this.element.classList.remove('ol-street-view--activated-on-dragging');
            // Reset Pegman
            this.pegmanDraggable.classList.remove('ol-street-view--can-drop', 'ol-street-view--dragged', 'ol-street-view--left', 'ol-street-view--right', 'ol-street-view--active', 'ol-street-view--dropped');
            this.pegmanDraggable.removeAttribute('style');
            this.pegmanDraggable.removeAttribute('data-x');
            this.pegmanDraggable.removeAttribute('data-y');
            // Remove Dropzone Feedback
            this._viewport.classList.remove('ol-street-view--drop-active', 'ol-street-view--drop-target');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchmove', onMouseMove);
        };
        // Add Escape support to abort the dragging
        document.addEventListener('keydown', ({ key }) => {
            if (this._isDragging && key === 'Escape') {
                stopInteract();
                terminateDragging();
                this._removeStreetViewXyzLayer();
            }
        });
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
                stopInteract = e.interaction.stop;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('touchmove', onMouseMove);
                this.pegmanDraggable.classList.remove('ol-street-view--dropped');
                const pTarget = e.target, 
                // Keep the Dragged Position in the data-x/data-y Attributes
                x = (parseFloat(pTarget.getAttribute('data-x')) || 0) +
                    e.dx, y = (parseFloat(pTarget.getAttribute('data-y')) || 0) +
                    e.dy;
                // Translate the Element
                pTarget.style.webkitTransform =
                    pTarget.style.transform = `translate(${x}px, ${y}px)`;
                // Update the Position Attributes
                pTarget.setAttribute('data-x', x);
                pTarget.setAttribute('data-y', y);
            },
            onend: (e) => {
                const viewportOffset = this.mapContainer.getBoundingClientRect();
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
                this.element.classList.add('ol-street-view--activated-on-dragging');
                this.pegmanDraggable.classList.add('ol-street-view--active', 'ol-street-view--can-drop');
                this._viewport.classList.add('ol-street-view--drop-target');
            },
            ondragleave: () => {
                // Remove the Drop Feedback Style
                this._viewport.classList.remove('ol-street-view--drop-target');
                this.pegmanDraggable.classList.remove('ol-street-view--can-drop');
            },
            ondrop: () => {
                this.pegmanDraggable.classList.add('ol-street-view--dropped');
            },
            ondropdeactivate: () => terminateDragging()
        });
    }
    _addMapControls() {
        const preparePegmanControl = () => {
            this.pegmanDivControl = this.element;
            this.pegmanDivControl.id = 'ol-street-view--pegman-button-div';
            this.pegmanDivControl.className = `ol-street-view--${this._options.size}-btn ol-control ol-street-view--disabled ${this._options.transparentButton
                ? 'ol-street-view--transparent'
                : ''}`;
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
        const getSizeTogglerControl = () => {
            const CLASS_COMPACT = 'ol-street-view--compact';
            const CLASS_HIDDEN = 'ol-street-view--hidden';
            if (this._options.defaultMapSize === 'compact') {
                this.mapContainer.classList.add(CLASS_COMPACT);
            }
            else if (this._options.defaultMapSize === 'hidden') {
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
                const toggle = this.mapContainer.classList.toggle(CLASS_COMPACT);
                if (toggle) {
                    // Minimized
                    togglerBtn.title = this._i18n.expand;
                    // Store height for later
                    this._lastHeight = this._viewport.style.height;
                    // Restore height if it was resized
                    this._viewport.style.height = null;
                }
                else {
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
    async _loadStreetView() {
        if (libraryLoaded)
            return;
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
    _updateStreetViewPosition(coords) {
        const latLon = transform(coords, this._view.getProjection(), 'EPSG:4326').reverse();
        const latLonGoogle = { lat: latLon[0], lng: latLon[1] };
        //@ts-ignore-error this method is missing in the @types
        this._streetViewService.getPanoramaByLocation(latLonGoogle, this._options.radius, (streetViewPanoramaData, status) => {
            if (status === google.maps.StreetViewStatus.OK) {
                this._panorama.setPosition(latLonGoogle);
                this._panorama.setVisible(true);
                this._panorama.setZoom(1);
                if (this._options.updatePegmanToClosestPanorama) {
                    this._remvoveTranslateInteractionEvent();
                    this._updatePegmanPosition(streetViewPanoramaData.location.latLng, true);
                    this._addTranslateInteractionEvent();
                }
            }
            else {
                this._showNoDataMode();
                this._updatePegmanPosition(coords, false);
            }
        });
    }
    _updatePegmanPosition(coords, isGoogleFormat = true) {
        // If the coordinates are in Google format, extract the values,
        // and convert the projection
        if (isGoogleFormat) {
            coords = transform([
                coords.lng(),
                coords.lat()
            ], 'EPSG:4326', this._view.getProjection());
        }
        this._pegmanSelectedCoords = coords;
        this._pegmanFeature
            .getGeometry()
            .setCoordinates(this._pegmanSelectedCoords);
        this._centerMapToPegman();
    }
    _centerMapToPegman() {
        this._view.animate({
            center: this._pegmanSelectedCoords,
            duration: 100
        });
    }
    _initPegmanOnMap() {
        if (this._pegmanLayer.getSource().getFeatures().length) {
            return;
        }
        // Add Class to container
        if (!this.mapContainer.classList.contains('ol-street-view--activated')) {
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
        }
        else {
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
    _showNoDataMode() {
        this._panorama.setVisible(false);
    }
    /**
     * Map click listener to translate StreetView position
     */
    _addClickListener() {
        const clickListener = (evt) => {
            this._updateStreetViewPosition(evt.coordinate);
            evt.preventDefault();
            evt.stopPropagation();
        };
        this._clickOnMapEventKey = this._map.on('click', clickListener);
    }
    _refreshMap(centerToPegman = true) {
        if (!this._map)
            return;
        // Force refresh the layers
        this._map.updateSize();
        window.dispatchEvent(new Event('resize'));
        if (centerToPegman)
            this._centerMapToPegman();
    }
    /**
     * Show Street View mode
     * @param coords Must be in the map projection format
     * @fires streetViewInit
     */
    _showStreetView(coords) {
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
    _addStreetViewXyzLayer() {
        if (!this._addedXyzLayer)
            this._map.addLayer(this._streetViewXyzLayer);
        this._addedXyzLayer = true;
    }
    _removeStreetViewXyzLayer() {
        this._map.removeLayer(this._streetViewXyzLayer);
        this._addedXyzLayer = false;
    }
    /**
     * This is useful if wou wanna add a custom icon on the panorama instance,
     * add custom listeners, etc
     * @returns {google.maps.StreetViewPanorama}
     */
    getStreetViewPanorama() {
        return this._panorama;
    }
    /**
     * Get the Vector Layer in wich Pegman is displayed
     * @returns {VectorLayer<VectorSource>}
     */
    getPegmanLayer() {
        return this._pegmanLayer;
    }
    /**
     * Get the background Raster layer that displays the existing zones with Street View available
     * @returns {TileLayer<XYZ>}
     */
    getStreetViewLayer() {
        return this._streetViewXyzLayer;
    }
    /**
     * Show Street View mode
     * @fires streetViewInit
     * @param {Coordinate} coords Must be in the map projection format
     * @returns {google.maps.StreetViewPanorama}
     */
    showStreetView(coords) {
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
    hideStreetView() {
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
        if (document.fullscreenElement)
            document.exitFullscreen();
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
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
/**
 * @public
 */
var SVEventTypes;
(function (SVEventTypes) {
    SVEventTypes["LOAD_LIB"] = "loadLib";
    SVEventTypes["STREET_VIEW_INIT"] = "streetViewInit";
    SVEventTypes["STREET_VIEW_EXIT"] = "streetViewExit";
})(SVEventTypes || (SVEventTypes = {}));
/**
 * @public
 */
var Language;
(function (Language) {
    Language["ES"] = "es";
    Language["EN"] = "en";
})(Language || (Language = {}));
/**
 * @public
 */
var BtnControlSize;
(function (BtnControlSize) {
    BtnControlSize["Small"] = "sm";
    BtnControlSize["Medium"] = "md";
    BtnControlSize["Large"] = "lg";
})(BtnControlSize || (BtnControlSize = {}));
/**
 * @public
 */
var MapSize;
(function (MapSize) {
    MapSize["Expanded"] = "expanded";
    MapSize["Compact"] = "compact";
    MapSize["Hidden"] = "hidden";
})(MapSize || (MapSize = {}));

export { BtnControlSize, Language, MapSize, SVEventTypes, StreetView as default };
//# sourceMappingURL=ol-street-view.js.map
