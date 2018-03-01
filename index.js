import * as maptalks from 'maptalks';
import * as Cesium from 'Cesium';

const options = {
    sceneOptions : null,
    forceRenderOnZooming : true,
    forceRenderOnMoving : true,
    forceRenderOnRotating : true
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
}

CesiumLayer.mergeOptions(options);

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
        let sceneOptions = this.layer.options.sceneOptions || {};
        sceneOptions = maptalks.Util.extend(sceneOptions, {
            canvas : this.canvas,
            scene3DOnly : true
        });
        this.scene = new Cesium.Scene(sceneOptions);
        this.scene.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
        this.globe = new Cesium.Globe(Cesium.Ellipsoid.WGS84);
        this.globe.baseColor = Cesium.Color.WHITE;
        this.scene.globe = this.globe;
        this.scene.skyAtmosphere = new Cesium.SkyAtmosphere();
        //ol.proj.Units.METERS_PER_UNIT[ol.proj.Units.DEGREES] = 2 * Math.PI * 6370997 / 360;
    }

    clearCanvas() {
        if (!this.canvas) {
            return;
        }
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

        let fov;
        if (this.canvas.height > this.canvas.width) {
            fov = map.getFov() * Math.PI / 180;
        } else {
            fov = map.getFov() * Math.PI / 180 * this.canvas.width / this.canvas.height;
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
            pitch : pitch - Math.PI / 2,
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
