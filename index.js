import * as maptalks from 'maptalks';
import * as Cesium from 'Cesium';
export { default as Primitive } from './src/Primitive';
export { default as Cesium3DTileset } from './src/Cesium3DTileset';

const EVENTS = [
    'mousemove',
    'click',
    'mousedown',
    'mouseup',
    'dblclick',
    'contextmenu',
    'touchstart',
    'touchmove',
    'touchend'
];

function cesiumCanvas(canvas) {
    Object.defineProperty(canvas, 'clientWidth', {
        get() { return canvas.width; }
    });
    Object.defineProperty(canvas, 'clientHeight', {
        get() { return canvas.height; }
    });

}


const options = {
    sceneOptions: null,
    forceRenderOnZooming: true,
    forceRenderOnMoving: true,
    forceRenderOnRotating: true
};

export class CesiumLayer extends maptalks.CanvasLayer {
    getCesiumScene() {
        const renderer = this._getRenderer();
        if (!renderer) {
            return null;
        }
        return renderer.scene;
    }

    getCameraAltitude() {
        const renderer = this._getRenderer();
        if (!renderer) {
            return 0;
        }
        const camera = this.getCesiumScene().camera;
        const carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
            camera.position);

        return carto.height;
    }

    redraw() {
        const renderer = this._getRenderer();
        if (!renderer) {
            return null;
        }
        return renderer.setToRedraw();
    }

    /**
   *
   * @param {Coordinate} coordinate
   * @param {Object} options
   * @return {Array}
   */
    identify(coordinate, options) {
        const scene = this.getCesiumScene();
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
        const p = this.getMap().coordToContainerPoint(coordinate);
        const { x, y } = p;

        let primitives = scene.pick(new Cesium.Cartesian2(x, y));
        if (!primitives) {
            return [];
        }
        primitives = [primitives];

        options = maptalks.Util.extend({}, options);
        const count = options.count;
        return (maptalks.Util.isNumber(count) && count > 0 ? primitives.slice(0, count) : primitives);
    }

    // onSelect()


    // eslint-disable-next-line no-unused-vars
    _identifyPrimitiveEvents(e) {
        const map = this.map || this.getMap();
        map.resetCursor('default');
        const { type, coordinate } = e;
        const primitives = this.identify(coordinate).map(p => {
            const { primitive } = p;
            for (const key in p) {
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
            const outPrimitives = [];
            if (this.selectPrimitives) {
                this.selectPrimitives.forEach(primitive => {
                    let isOut = true;
                    primitives.forEach(p => {
                        if (primitive === p) {
                            isOut = false;
                        }
                    });
                    if (isOut) {
                        outPrimitives.push(primitive);
                    }
                });
            }
            outPrimitives.forEach(primitive => {
                if (primitive._fire) {
                    primitive._mouseover = false;
                    primitive._fire('mouseout', Object.assign({}, e, { target: primitive, type: 'mouseout' }));
                    // eslint-disable-next-line no-unused-expressions
                    primitive.closeToolTip && primitive.closeToolTip();
                } else if (this.onSelect) {
                    this.onSelect(Object.assign({}, e, { target: primitive, type: 'mouseout' }));
                }
            });
            primitives.forEach(primitive => {
                if (primitive._fire) {
                    if (!primitive._mouseover) {
                        primitive._fire('mouseover', Object.assign({}, e, { target: primitive, type: 'mouseover' }));
                        primitive._mouseover = true;
                    }
                    primitive._fire(type, Object.assign({}, e, { target: primitive }));
                    // tooltip
                    if (primitive.getToolTip) {
                        const tooltip = primitive.getToolTip();
                        if (tooltip && (!tooltip._owner)) {
                            tooltip.addTo(primitive);
                        }
                        primitive.openToolTip(coordinate);
                    }
                } else if (this.onSelect) {
                    if (!primitive._mouseover) {
                        this.onSelect(Object.assign({}, e, { target: primitive, type: 'mouseover' }));
                        primitive._mouseover = true;
                    }
                    this.onSelect(Object.assign({}, e, { target: primitive, type }));
                }
            });
        } else {
            primitives.forEach(primitive => {
                if (primitive.fire) {
                    primitive._fire(type, Object.assign({}, e, { target: primitive }));
                    if (type === 'click') {
                        if (primitive.getInfoWindow) {
                            const infoWindow = primitive.getInfoWindow();
                            if (infoWindow && (!infoWindow._owner)) {
                                infoWindow.addTo(primitive);
                            }
                            primitive.openInfoWindow(coordinate);
                        }
                    }
                } else if (this.onSelect) {
                    this.onSelect(Object.assign({}, e, { target: primitive, type }));
                }
            });
        }
        this.selectPrimitives = primitives;
        return this;
    }

    onAdd() {
        super.onAdd();
        const map = this.map || this.getMap();
        if (!map) return this;
        this.selectPrimitives = this.selectPrimitives || [];
        EVENTS.forEach(event => {
            map.on(event, this._identifyPrimitiveEvents, this);
        });
        return this;
    }

    onRemove() {
        super.onRemove();
        const map = this.map || this.getMap();
        if (!map) return this;
        EVENTS.forEach(event => {
            map.off(event, this._identifyPrimitiveEvents, this);
        });
        return this;
    }

    addPrimitive(primitives) {
        if (!Array.isArray(primitives)) {
            primitives = [primitives];
        }
        const scene = this.getCesiumScene();
        if (scene) {
            primitives.forEach(primitive => {
                primitive._layer = this;
                scene.primitives.add(primitive);
            });
        }
        return this;
    }

    removePrimitive(primitives) {
        if (!Array.isArray(primitives)) {
            primitives = [primitives];
        }
        const scene = this.getCesiumScene();
        if (scene) {
            primitives.forEach(primitive => {
                scene.primitives.remove(primitive);
            });
        }
        return this;
    }

}

CesiumLayer.mergeOptions(options);

const backColor = [112, 112, 112, 255];

class CeisumLayerRenderer extends maptalks.renderer.CanvasRenderer {

    needToRedraw() {
        return true;
    }

    onAdd() {
        this.prepareCanvas();
    }

    _adjust(p) {
        const h = this.canvas.height / 2;
        p.y += 20 * ((p.y - h) / h);
        return p;
    }

    draw() {
        this.prepareCanvas();
        this._locateCamera();
        this._renderCesiumScene();
        this.completeRender();
    }

    drawOnInteracting() {
        this.prepareCanvas();
        this._locateCamera();
        this._renderCesiumScene();
        this.completeRender();
    }

    createContext() {
        const container = document.createElement('div');
        container.appendChild(this.canvas);
        // this is adapt for cesium
        // https://github.com/CesiumGS/cesium/blob/master/Source/Scene/SceneTransforms.js#L383
        cesiumCanvas(this.canvas);

        let sceneOptions = this.layer.options.sceneOptions || {};
        sceneOptions = maptalks.Util.extend(sceneOptions, {
            canvas: this.canvas,
            scene3DOnly: true
        });
        this.scene = new Cesium.Scene(sceneOptions);
        this.scene.fog.enabled = false;
        this.scene.backgroundColor = new Cesium.Color(backColor[0] / 255, backColor[1] / 255, backColor[2] / 255, 1);
        this.scene.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
        this.globe = new Cesium.Globe(Cesium.Ellipsoid.WGS84);
        this.globe.baseColor = new Cesium.Color(backColor[0] / 255, backColor[1] / 255, backColor[2] / 255, 1);
        this.scene.globe = this.globe;
        // this.scene.globe.show = false;
        // this.scene.skyAtmosphere = new Cesium.SkyAtmosphere();
    }

    clearCanvas() {
        if (!this.canvas) {
            return;
        }
    }

    getCanvasImage() {
        const canvasImage = super.getCanvasImage();
        if (!canvasImage || !canvasImage.image) {
            return canvasImage;
        }
        const canvas = canvasImage.image;
        if (!this.buffer) {
            this.buffer = document.createElement('canvas');
        }
        const buffer = this.buffer;
        const w = buffer.width = canvas.width;
        const h = buffer.height = canvas.height;
        const ctx = buffer.getContext('2d');

        ctx.drawImage(canvas, 0, 0);
        const imgData = ctx.getImageData(0, 0, w, h);
        const sourceData = imgData.data;
        for (let i = 0, l = sourceData.length; i < l; i += 4) {
            if (sourceData[i] === backColor[0] && sourceData[i + 1] === backColor[1] &&
                sourceData[i + 2] === backColor[2] /* && sourceData[i + 3] === backColor[3] */) {
                sourceData[i + 3] = 0;
            } else if (this.layer.options['gray']) {
                const gray = [sourceData[i] + sourceData[i + 1] + sourceData[i + 2]] / 3;
                sourceData[i] = gray;
                sourceData[i + 1] = gray;
                sourceData[i + 2] = gray;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        canvasImage.image = buffer;
        return canvasImage;
    }

    resizeCanvas(canvasSize) {
        super.resizeCanvas(canvasSize);
        if (this.canvas) {
            this.scene.camera.frustum.aspectRatio = this.canvas.width / this.canvas.height;
        }
    }

    _sceneReady() {
        if (this.scene.terrainProvider && !this.scene.terrainProvider.ready) {
            return false;
        }
        if (this.scene.imageryLayers) {
            const imageLayers = this.scene.imageryLayers;
            const count = imageLayers.length;
            for (let i = 0; i < count; i++) {
                if (!imageLayers.get(i).imageryProvider.ready) {
                    return false;
                }
            }
        }
        return true;
    }

    _renderCesiumScene() {
        this.scene.initializeFrame();
        this.scene.render(Cesium.JulianDate.now());
    }

    _locateCamera() {
        const map = this.getMap();
        const center = map.getCenter();//map.pointToCoord(new maptalks.Coordinate(map.cameraPosition), map.getGLZoom());
        const scene = this.scene;
        if (!center) {
            return;
        }

        let fov = map.getFov() * Math.PI / 180;
        if (this.canvas.height < this.canvas.width) {
            const aspectRatio = this.canvas.width / this.canvas.height;
            fov = 2 * Math.atan(Math.tan(0.5 * fov) * aspectRatio);
        }
        scene.camera.frustum.fov = fov;

        const ll = center.toArray();
        const pitch = toRadians(map.getPitch());

        const distance = this._calcDistance(map);

        const carto = new Cesium.Cartographic(toRadians(ll[0]),
            toRadians(ll[1]));
        if (scene.globe) {
            const height = scene.globe.getHeight(carto);
            carto.height = height || 0;
        }
        const destination = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);

        /** @type {Cesium.optionsOrientation} */
        const orientation = {
            pitch: pitch - Math.PI / 2,
            heading: toRadians(map.getBearing()),
            roll: undefined
        };
        scene.camera.setView({
            destination,
            orientation
        });

        scene.camera.moveBackward(distance);
    }

    _calcDistance(map) {
        const canvas = this.canvas;
        const fov = this.scene.camera.frustum.fov; // horizontal field of view

        const c = map.getCenter();
        const b = map.locateByPoint(c, -canvas.width / 2, 0);
        const e = map.locateByPoint(c, canvas.width / 2, 0);
        const requiredDistance = (map.computeLength(e, b) / 2) / Math.tan(fov / 2);

        return requiredDistance;
    }
}
CesiumLayer.registerRenderer('canvas', CeisumLayerRenderer);

function toRadians(d) {
    return d * Math.PI / 180;
}
