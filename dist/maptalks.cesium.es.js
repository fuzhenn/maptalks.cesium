/*!
 * maptalks.cesium v0.0.0
 * LICENSE : MIT
 * (c) 2016-2018 maptalks.org
 */
/*!
 * requires maptalks@<2.0.0 
 */
import { CanvasLayer, Util, renderer } from 'maptalks';
import { Cartesian3, Cartographic, Color, Ellipsoid, Globe, JulianDate, Scene } from 'Cesium';

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

var backColor = [112, 112, 112, 255];

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
        this.scene.fog.enabled = false;
        this.scene.backgroundColor = new Color(backColor[0] / 255, backColor[1] / 255, backColor[2] / 255, 1);
        this.scene.camera.constrainedAxis = Cartesian3.UNIT_Z;
        this.globe = new Globe(Ellipsoid.WGS84);
        this.globe.baseColor = new Color(backColor[0] / 255, backColor[1] / 255, backColor[2] / 255, 1);
        this.scene.globe = this.globe;
        // this.scene.globe.show = false;
        // this.scene.skyAtmosphere = new Cesium.SkyAtmosphere();
    };

    CeisumLayerRenderer.prototype.clearCanvas = function clearCanvas() {
        if (!this.canvas) {
            return;
        }
    };

    CeisumLayerRenderer.prototype.getCanvasImage = function getCanvasImage() {
        var canvasImage = _maptalks$renderer$Ca.prototype.getCanvasImage.call(this);
        if (!canvasImage || !canvasImage.image) {
            return canvasImage;
        }
        var canvas = canvasImage.image;
        if (!this.buffer) {
            this.buffer = document.createElement('canvas');
        }
        var buffer = this.buffer;
        var w = buffer.width = canvas.width;
        var h = buffer.height = canvas.height;
        var ctx = buffer.getContext('2d');

        ctx.drawImage(canvas, 0, 0);
        var imgData = ctx.getImageData(0, 0, w, h);
        var sourceData = imgData.data;
        for (var i = 0, l = sourceData.length; i < l; i += 4) {
            if (sourceData[i] === backColor[0] && sourceData[i + 1] === backColor[1] && sourceData[i + 2] === backColor[2] /* && sourceData[i + 3] === backColor[3] */) {
                    sourceData[i + 3] = 0;
                } else if (this.layer.options['gray']) {
                var gray = [sourceData[i] + sourceData[i + 1] + sourceData[i + 2]] / 3;
                sourceData[i] = gray;
                sourceData[i + 1] = gray;
                sourceData[i + 2] = gray;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        canvasImage.image = buffer;
        return canvasImage;
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

        var fov = void 0;
        if (this.canvas.height > this.canvas.width) {
            fov = map.getFov() * Math.PI / 180;
        } else {
            fov = map.getFov() * Math.PI / 180 * this.canvas.width / this.canvas.height;
        }
        scene.camera.frustum.fov = fov;

        var ll = center.toArray();
        var pitch = toRadians(map.getPitch());

        var distance = this._calcDistance(map);

        var carto = new Cartographic(toRadians(ll[0]), toRadians(ll[1]));
        if (scene.globe) {
            var height = scene.globe.getHeight(carto);
            carto.height = height || 0;
        }
        var destination = Ellipsoid.WGS84.cartographicToCartesian(carto);

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

        scene.camera.moveBackward(distance);
    };

    CeisumLayerRenderer.prototype._calcDistance = function _calcDistance(map) {
        var canvas = this.canvas;
        var fov = this.scene.camera.frustum.fov; // horizontal field of view

        var c = map.getCenter();
        var b = map.locateByPoint(c, -canvas.width / 2, 0);
        var e = map.locateByPoint(c, canvas.width / 2, 0);
        var requiredDistance = map.computeLength(e, b) / 2 / Math.tan(fov / 2);

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
