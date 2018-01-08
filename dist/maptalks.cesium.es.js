/*!
 * maptalks.cesium v0.0.0
 * LICENSE : MIT
 * (c) 2016-2018 maptalks.org
 */
/*!
 * requires maptalks@<2.0.0 
 */
import { CanvasLayer, Util, renderer } from 'maptalks';
import { Cartesian3, Cartographic, Color, Ellipsoid, Globe, JulianDate, Scene, SkyAtmosphere } from 'Cesium';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var options = {
    sceneOptions: null,
    forceRenderOnZooming: true,
    forceRenderOnMoving: true,
    forceRenderOnRotating: true
};

var CesiumLayer = function (_maptalks$CanvasLayer) {
    _inherits(CesiumLayer, _maptalks$CanvasLayer);

    function CesiumLayer() {
        _classCallCheck(this, CesiumLayer);

        return _possibleConstructorReturn(this, _maptalks$CanvasLayer.apply(this, arguments));
    }

    CesiumLayer.prototype.getCesiumScene = function getCesiumScene() {
        var renderer$$1 = this._getRenderer();
        if (!renderer$$1) {
            return null;
        }
        return renderer$$1.scene;
    };

    CesiumLayer.prototype.getCameraAltitude = function getCameraAltitude() {
        var renderer$$1 = this._getRenderer();
        if (!renderer$$1) {
            return 0;
        }
        var camera = this.getCesiumScene().camera;
        var carto = Ellipsoid.WGS84.cartesianToCartographic(camera.position);

        return carto.height;
    };

    CesiumLayer.prototype.redraw = function redraw() {
        var renderer$$1 = this._getRenderer();
        if (!renderer$$1) {
            return null;
        }
        return renderer$$1.setToRedraw();
    };

    return CesiumLayer;
}(CanvasLayer);

CesiumLayer.mergeOptions(options);

var CeisumLayerRenderer = function (_maptalks$renderer$Ca) {
    _inherits(CeisumLayerRenderer, _maptalks$renderer$Ca);

    function CeisumLayerRenderer() {
        _classCallCheck(this, CeisumLayerRenderer);

        return _possibleConstructorReturn(this, _maptalks$renderer$Ca.apply(this, arguments));
    }

    CeisumLayerRenderer.prototype.needToRedraw = function needToRedraw() {
        return true;
    };

    CeisumLayerRenderer.prototype.onAdd = function onAdd() {
        this.prepareCanvas();
    };

    CeisumLayerRenderer.prototype._adjust = function _adjust(p) {
        var h = this.canvas.height / 2;
        p.y += 20 * ((p.y - h) / h);
        return p;
    };

    CeisumLayerRenderer.prototype.draw = function draw() {
        this.prepareCanvas();
        this._locateCamera();
        this._renderCesiumScene();
        this.completeRender();
    };

    CeisumLayerRenderer.prototype.drawOnInteracting = function drawOnInteracting() {
        this.prepareCanvas();
        this._locateCamera();
        this._renderCesiumScene();
        this.completeRender();
    };

    CeisumLayerRenderer.prototype.createContext = function createContext() {
        var container = document.createElement('div');
        container.appendChild(this.canvas);
        var sceneOptions = this.layer.options.sceneOptions || {};
        sceneOptions = Util.extend(sceneOptions, {
            canvas: this.canvas,
            scene3DOnly: true
        });
        this.scene = new Scene(sceneOptions);
        this.scene.camera.constrainedAxis = Cartesian3.UNIT_Z;
        this.scene.camera.fov = Math.PI / 2; //90
        this.globe = new Globe(Ellipsoid.WGS84);
        this.globe.baseColor = Color.WHITE;
        this.scene.globe = this.globe;
        this.scene.skyAtmosphere = new SkyAtmosphere();
        //ol.proj.Units.METERS_PER_UNIT[ol.proj.Units.DEGREES] = 2 * Math.PI * 6370997 / 360;
    };

    CeisumLayerRenderer.prototype.clearCanvas = function clearCanvas() {
        if (!this.canvas) {
            return;
        }
    };

    CeisumLayerRenderer.prototype.resizeCanvas = function resizeCanvas(canvasSize) {
        _maptalks$renderer$Ca.prototype.resizeCanvas.call(this, canvasSize);
        if (this.canvas) {
            this.scene.camera.frustum.aspectRatio = this.canvas.width / this.canvas.height;
        }
    };

    CeisumLayerRenderer.prototype._sceneReady = function _sceneReady() {
        if (this.scene.terrainProvider && !this.scene.terrainProvider.ready) {
            return false;
        }
        if (this.scene.imageryLayers) {
            var imageLayers = this.scene.imageryLayers;
            var count = imageLayers.length;
            for (var i = 0; i < count; i++) {
                if (!imageLayers.get(i).imageryProvider.ready) {
                    return false;
                }
            }
        }
        return true;
    };

    CeisumLayerRenderer.prototype._renderCesiumScene = function _renderCesiumScene() {
        this.scene.initializeFrame();
        this.scene.render(JulianDate.now());
    };

    CeisumLayerRenderer.prototype._locateCamera = function _locateCamera() {
        var map = this.getMap();
        var center = map.getCenter(); //map.pointToCoord(new maptalks.Coordinate(map.cameraPosition), map.getGLZoom());
        var scene = this.scene;
        if (!center) {
            return;
        }
        var ll = center.toArray();

        var carto = new Cartographic(toRadians(ll[0]), toRadians(ll[1]));
        if (scene.globe) {
            var height = scene.globe.getHeight(carto);
            carto.height = height || 0;
        }
        // carto.height = 0;
        var destination = Ellipsoid.WGS84.cartographicToCartesian(carto);
        var pitch = toRadians(map.getPitch());
        /** @type {Cesium.optionsOrientation} */
        var orientation = {
            pitch: pitch - Math.PI / 2,
            heading: toRadians(map.getBearing()),
            roll: undefined
        };
        scene.camera.setView({
            destination: destination,
            orientation: orientation
        });
        // const cameraPosition = map.pointToCoord(new maptalks.Coordinate(map.cameraPosition), map.getGLZoom());
        // const resolution = map.getResolution();
        // const distance = this._calcDistanceForResolution(
        //     // resolution || 0, toRadians(ll[1]));
        //     resolution, map);
        var distance = this._calcDistance(map);

        scene.camera.moveBackward(distance);
    };

    CeisumLayerRenderer.prototype._calcDistance = function _calcDistance(map) {
        var canvas = this.canvas;
        var fovy = this.scene.camera.frustum.fov; // horizontal field of view

        var c = map.getCenter();
        var b = map.locateByPoint(c, canvas.width, 0);
        var requiredDistance = map.computeLength(c, b) / 2 / Math.tan(fovy / 2);

        // const pitch = toRadians(map.getPitch());
        return requiredDistance;
    };

    CeisumLayerRenderer.prototype._calcDistanceForResolution2 = function _calcDistanceForResolution2(resolution, latitude) {
        var canvas = this.canvas;
        var fovy = this.scene.camera.frustum.fov; // vertical field of view
        var metersPerUnit = resolution; //2 * Math.PI * 6370997 / 360;

        // number of "map units" visible in 2D (vertically)
        var visibleMapUnits = canvas.width;

        // The metersPerUnit does not take latitude into account, but it should
        // be lower with increasing latitude -- we have to compensate.
        // In 3D it is not possible to maintain the resolution at more than one point,
        // so it only makes sense to use the latitude of the "target" point.
        var relativeCircumference = Math.cos(Math.abs(latitude));

        // how many meters should be visible in 3D
        var visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;

        // distance required to view the calculated length in meters
        //
        //  fovy/2
        //    |\
        //  x | \
        //    |--\
        // visibleMeters/2
        var requiredDistance = visibleMeters / 2 / Math.tan(fovy / 2);

        // NOTE: This calculation is not absolutely precise, because metersPerUnit
        // is a great simplification. It does not take ellipsoid/terrain into account.

        return requiredDistance;
    };

    return CeisumLayerRenderer;
}(renderer.CanvasRenderer);

CesiumLayer.registerRenderer('canvas', CeisumLayerRenderer);

function toRadians(d) {
    return d * Math.PI / 180;
}

export { CesiumLayer };

typeof console !== 'undefined' && console.log('maptalks.cesium v0.0.0, requires maptalks@<2.0.0.');
