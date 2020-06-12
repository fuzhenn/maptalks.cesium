/*!
 * maptalks.cesium v0.0.0
 * LICENSE : MIT
 * (c) 2016-2020 maptalks.org
 */
/*!
 * requires maptalks@<2.0.0 
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks'), require('Cesium')) :
	typeof define === 'function' && define.amd ? define(['exports', 'maptalks', 'Cesium'], factory) :
	(factory((global.maptalks = global.maptalks || {}),global.maptalks,global.Cesium));
}(this, (function (exports,maptalks,Cesium) { 'use strict';

var Mixins = {
    getCenter: function getCenter() {
        return null;
    },
    getMap: function getMap() {
        var layer = this._layer;
        if (layer) {
            return layer.getMap();
        }
        return null;
    },
    setInfoWindow: function setInfoWindow(options) {
        this.infoWindow = new maptalks.ui.InfoWindow(options);
        return this;
    },
    getInfoWindow: function getInfoWindow() {
        return this.infoWindow;
    },
    openInfoWindow: function openInfoWindow(coordinate) {
        // eslint-disable-next-line no-unused-expressions
        coordinate && this.infoWindow && this.infoWindow.show(coordinate);
        return this;
    },
    closeInfoWindow: function closeInfoWindow() {
        // eslint-disable-next-line no-unused-expressions
        this.infoWindow && this.infoWindow.hide();
        return this;
    },
    removeInfoWindow: function removeInfoWindow() {
        // eslint-disable-next-line no-unused-expressions
        this.infoWindow && this.infoWindow.remove() && delete this.infoWindow;
        return this;
    },
    setToolTip: function setToolTip(content, options) {
        this.toolTip = new maptalks.ui.ToolTip(content, options);
        return this;
    },
    getToolTip: function getToolTip() {
        return this.toolTip;
    },
    openToolTip: function openToolTip(coordinate) {
        // eslint-disable-next-line no-unused-expressions
        coordinate && this.toolTip && this.toolTip.show(coordinate);
        return this;
    },
    closeToolTip: function closeToolTip() {
        // eslint-disable-next-line no-unused-expressions
        this.toolTip && this.toolTip.hide();
        return this;
    },
    removeToolTip: function removeToolTip() {
        // eslint-disable-next-line no-unused-expressions
        this.toolTip && this.toolTip.remove() && delete this.toolTip;
        return this;
    }
};

function _defaults$1(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$1(subClass, superClass); }

var Primitive$1 = function (_maptalks$Eventable) {
  _inherits$1(Primitive$$1, _maptalks$Eventable);

  function Primitive$$1() {
    _classCallCheck$1(this, Primitive$$1);

    return _possibleConstructorReturn$1(this, _maptalks$Eventable.apply(this, arguments));
  }

  return Primitive$$1;
}(maptalks.Eventable(Cesium.Primitive));

maptalks.Util.extend(Primitive$1.prototype, Mixins);

function _defaults$2(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$2(subClass, superClass); }

var Cesium3DTileset$1 = function (_maptalks$Eventable) {
  _inherits$2(Cesium3DTileset$$1, _maptalks$Eventable);

  function Cesium3DTileset$$1() {
    _classCallCheck$2(this, Cesium3DTileset$$1);

    return _possibleConstructorReturn$2(this, _maptalks$Eventable.apply(this, arguments));
  }

  return Cesium3DTileset$$1;
}(maptalks.Eventable(Cesium.Cesium3DTileset));

maptalks.Util.extend(Cesium3DTileset$1.prototype, Mixins);

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var EVENTS = ['mousemove', 'click', 'mousedown', 'mouseup', 'dblclick', 'contextmenu', 'touchstart', 'touchmove', 'touchend'];

function cesiumCanvas(canvas) {
    Object.defineProperty(canvas, 'clientWidth', {
        get: function get() {
            return canvas.width;
        }
    });
    Object.defineProperty(canvas, 'clientHeight', {
        get: function get() {
            return canvas.height;
        }
    });
}

var options = {
    sceneOptions: null,
    forceRenderOnZooming: true,
    forceRenderOnMoving: true,
    forceRenderOnRotating: true,
    geometryEvents: false
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
        var carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(camera.position);

        return carto.height;
    };

    CesiumLayer.prototype.redraw = function redraw() {
        var renderer$$1 = this._getRenderer();
        if (!renderer$$1) {
            return null;
        }
        return renderer$$1.setToRedraw();
    };

    /**
    *
    * @param {Coordinate} coordinate
    * @param {Object} options
    * @return {Array}
    */


    CesiumLayer.prototype.identify = function identify(coordinate, options) {
        var scene = this.getCesiumScene();
        if (!scene) {
            return [];
        }
        if (!coordinate) {
            console.error('coordinate is null,it should be Coordinate');
            return [];
        }
        if (Array.isArray(coordinate)) {
            coordinate = new maptalks.Coordinate(coordinate);
        }
        if (!(coordinate instanceof maptalks.Coordinate)) {
            console.error('coordinate type is error,it should be Coordinate');
            return [];
        }
        var p = this.getMap().coordToContainerPoint(coordinate);
        var x = p.x,
            y = p.y;


        var primitives = scene.pick(new Cesium.Cartesian2(x, y));
        if (!primitives) {
            return [];
        }
        primitives = [primitives];

        options = maptalks.Util.extend({}, options);
        var count = options.count;
        return maptalks.Util.isNumber(count) && count > 0 ? primitives.slice(0, count) : primitives;
    };

    // onSelect()


    // eslint-disable-next-line no-unused-vars


    CesiumLayer.prototype._identifyPrimitiveEvents = function _identifyPrimitiveEvents(e) {
        var _this2 = this;

        if (!this.options.geometryEvents) {
            return this;
        }
        var map = this.map || this.getMap();
        var type = e.type,
            coordinate = e.coordinate;

        var now = maptalks.Util.now();
        if (this._mousemoveTimeOut && type === 'mousemove') {
            if (now - this._mousemoveTimeOut < 16) {
                return this;
            }
        }
        this._mousemoveTimeOut = now;
        map.resetCursor('default');
        var primitives = this.identify(coordinate).map(function (p) {
            var primitive = p.primitive;

            for (var key in p) {
                if (key !== 'primitive') {
                    primitive[key] = p[key];
                }
            }
            return primitive;
        });
        if (primitives.length) {
            map.setCursor('pointer');
        }
        if (type === 'mousemove') {
            // mouseout objects
            var outPrimitives = [];
            if (this.selectPrimitives) {
                this.selectPrimitives.forEach(function (primitive) {
                    var isOut = true;
                    primitives.forEach(function (p) {
                        if (primitive === p) {
                            isOut = false;
                        }
                    });
                    if (isOut) {
                        outPrimitives.push(primitive);
                    }
                });
            }
            outPrimitives.forEach(function (primitive) {
                if (primitive._fire) {
                    primitive._mouseover = false;
                    primitive._fire('mouseout', Object.assign({}, e, { target: primitive, type: 'mouseout' }));
                    // eslint-disable-next-line no-unused-expressions
                    primitive.closeToolTip && primitive.closeToolTip();
                } else if (_this2.onSelect) {
                    _this2.onSelect(Object.assign({}, e, { target: primitive, type: 'mouseout' }));
                }
            });
            primitives.forEach(function (primitive) {
                if (primitive._fire) {
                    if (!primitive._mouseover) {
                        primitive._fire('mouseover', Object.assign({}, e, { target: primitive, type: 'mouseover' }));
                        primitive._mouseover = true;
                    }
                    primitive._fire(type, Object.assign({}, e, { target: primitive }));
                    // tooltip
                    if (primitive.getToolTip) {
                        var tooltip = primitive.getToolTip();
                        if (tooltip && !tooltip._owner) {
                            tooltip.addTo(primitive);
                        }
                        primitive.openToolTip(coordinate);
                    }
                } else if (_this2.onSelect) {
                    if (!primitive._mouseover) {
                        _this2.onSelect(Object.assign({}, e, { target: primitive, type: 'mouseover' }));
                        primitive._mouseover = true;
                    }
                    _this2.onSelect(Object.assign({}, e, { target: primitive, type: type }));
                }
            });
        } else {
            primitives.forEach(function (primitive) {
                if (primitive._fire) {
                    primitive._fire(type, Object.assign({}, e, { target: primitive }));
                    if (type === 'click') {
                        if (primitive.getInfoWindow) {
                            var infoWindow = primitive.getInfoWindow();
                            if (infoWindow && !infoWindow._owner) {
                                infoWindow.addTo(primitive);
                            }
                            primitive.openInfoWindow(coordinate);
                        }
                    }
                } else if (_this2.onSelect) {
                    _this2.onSelect(Object.assign({}, e, { target: primitive, type: type }));
                }
            });
        }
        this.selectPrimitives = primitives;
        return this;
    };

    CesiumLayer.prototype.onAdd = function onAdd() {
        var _this3 = this;

        _maptalks$CanvasLayer.prototype.onAdd.call(this);
        var map = this.map || this.getMap();
        if (!map) return this;
        this.selectPrimitives = this.selectPrimitives || [];
        EVENTS.forEach(function (event) {
            map.on(event, _this3._identifyPrimitiveEvents, _this3);
        });
        return this;
    };

    CesiumLayer.prototype.onRemove = function onRemove() {
        var _this4 = this;

        _maptalks$CanvasLayer.prototype.onRemove.call(this);
        var map = this.map || this.getMap();
        if (!map) return this;
        EVENTS.forEach(function (event) {
            map.off(event, _this4._identifyPrimitiveEvents, _this4);
        });
        return this;
    };

    CesiumLayer.prototype.addPrimitive = function addPrimitive(primitives) {
        var _this5 = this;

        if (!Array.isArray(primitives)) {
            primitives = [primitives];
        }
        var scene = this.getCesiumScene();
        if (scene) {
            primitives.forEach(function (primitive) {
                primitive._layer = _this5;
                scene.primitives.add(primitive);
            });
        }
        return this;
    };

    CesiumLayer.prototype.removePrimitive = function removePrimitive(primitives) {
        if (!Array.isArray(primitives)) {
            primitives = [primitives];
        }
        var scene = this.getCesiumScene();
        if (scene) {
            primitives.forEach(function (primitive) {
                scene.primitives.remove(primitive);
            });
        }
        return this;
    };

    return CesiumLayer;
}(maptalks.CanvasLayer);

CesiumLayer.mergeOptions(options);

// const backColor = [112, 112, 112, 255];
var globalColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);

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
        // this is adapt for cesium
        // https://github.com/CesiumGS/cesium/blob/master/Source/Scene/SceneTransforms.js#L383
        cesiumCanvas(this.canvas);

        var sceneOptions = this.layer.options.sceneOptions || {};
        sceneOptions = maptalks.Util.extend(sceneOptions, {
            canvas: this.canvas,
            scene3DOnly: true,
            contextOptions: {
                webgl: {
                    alpha: true
                }
            }
        });
        this.scene = new Cesium.Scene(sceneOptions);
        this.scene.fog.enabled = false;

        this.scene.backgroundColor = globalColor;
        this.scene.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
        this.globe = new Cesium.Globe(Cesium.Ellipsoid.WGS84);
        this.globe.baseColor = globalColor;
        this.scene.globe = this.globe;
        // this.scene.globe.show = false;
        // this.scene.skyAtmosphere = new Cesium.SkyAtmosphere();
    };

    CeisumLayerRenderer.prototype.clearCanvas = function clearCanvas() {
        if (!this.canvas) {
            return;
        }
    };

    // getCanvasImage() {
    //     const canvasImage = super.getCanvasImage();
    //     if (!canvasImage || !canvasImage.image) {
    //         return canvasImage;
    //     }
    //     const canvas = canvasImage.image;
    //     if (!this.buffer) {
    //         this.buffer = document.createElement('canvas');
    //     }
    //     const buffer = this.buffer;
    //     const w = buffer.width = canvas.width;
    //     const h = buffer.height = canvas.height;
    //     const ctx = buffer.getContext('2d');

    //     ctx.drawImage(canvas, 0, 0);
    //     const imgData = ctx.getImageData(0, 0, w, h);
    //     const sourceData = imgData.data;
    //     for (let i = 0, l = sourceData.length; i < l; i += 4) {
    //         if (sourceData[i] === backColor[0] && sourceData[i + 1] === backColor[1] &&
    //             sourceData[i + 2] === backColor[2] /* && sourceData[i + 3] === backColor[3] */) {
    //             sourceData[i + 3] = 0;
    //         } else if (this.layer.options['gray']) {
    //             const gray = [sourceData[i] + sourceData[i + 1] + sourceData[i + 2]] / 3;
    //             sourceData[i] = gray;
    //             sourceData[i + 1] = gray;
    //             sourceData[i + 2] = gray;
    //         }
    //     }
    //     ctx.putImageData(imgData, 0, 0);
    //     canvasImage.image = buffer;
    //     return canvasImage;
    // }

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
        this.scene.render(Cesium.JulianDate.now());
    };

    CeisumLayerRenderer.prototype._locateCamera = function _locateCamera() {
        var map = this.getMap();
        var center = map.getCenter(); //map.pointToCoord(new maptalks.Coordinate(map.cameraPosition), map.getGLZoom());
        var scene = this.scene;
        if (!center) {
            return;
        }

        var fov = map.getFov() * Math.PI / 180;
        if (this.canvas.height < this.canvas.width) {
            var aspectRatio = this.canvas.width / this.canvas.height;
            fov = 2 * Math.atan(Math.tan(0.5 * fov) * aspectRatio);
        }
        scene.camera.frustum.fov = fov;

        var ll = center.toArray();
        var pitch = toRadians(map.getPitch());

        var distance = this._calcDistance(map);

        var carto = new Cesium.Cartographic(toRadians(ll[0]), toRadians(ll[1]));
        if (scene.globe) {
            var height = scene.globe.getHeight(carto);
            carto.height = height || 0;
        }
        var destination = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);

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
}(maptalks.renderer.CanvasRenderer);

CesiumLayer.registerRenderer('canvas', CeisumLayerRenderer);

function toRadians(d) {
    return d * Math.PI / 180;
}

exports.CesiumLayer = CesiumLayer;
exports.Primitive = Primitive$1;
exports.Cesium3DTileset = Cesium3DTileset$1;

Object.defineProperty(exports, '__esModule', { value: true });

typeof console !== 'undefined' && console.log('maptalks.cesium v0.0.0, requires maptalks@<2.0.0.');

})));
