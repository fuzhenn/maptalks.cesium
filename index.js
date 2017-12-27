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

    createCanvas() {
        if (this.canvas) {
            return;
        }
        const map = this.getMap();
        const size = map.getSize();
        const r = maptalks.Browser.retina ? 2 : 1,
            w = r * size.width,
            h = r * size.height;
        if (this.layer._canvas) {
            const canvas = this.layer._canvas;
            canvas.width = w;
            canvas.height = h;
            if (canvas.style) {
                canvas.style.width = size.width + 'px';
                canvas.style.height = size.height + 'px';
            }
            this.canvas = this.layer._canvas;
        } else {
            this.canvas = maptalks.Canvas.createCanvas(w, h, map.CanvasClass);
        }

        const container = document.createElement('div');
        container.appendChild(this.canvas);
        let sceneOptions = this.layer.options.sceneOptions || {};
        sceneOptions = maptalks.Util.extend(sceneOptions, {
            canvas : this.canvas,
            scene3DOnly : true
        });
        this.scene = new Cesium.Scene(sceneOptions);
        this.scene.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
        this.scene.camera.fov = Math.PI / 2; //90
        this.globe = new Cesium.Globe(Cesium.Ellipsoid.WGS84);
        this.globe.baseColor = Cesium.Color.WHITE;
        this.scene.globe = this.globe;
        this.scene.skyAtmosphere = new Cesium.SkyAtmosphere();
        this.onCanvasCreate();

        this.layer.fire('canvascreate', {
            'context' : this.context,
            'gl' : this.gl
        });
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
        const ll = center.toArray();

        const carto = new Cesium.Cartographic(toRadians(ll[0]),
            toRadians(ll[1]));
        if (scene.globe) {
            const height = scene.globe.getHeight(carto);
            carto.height = height || 0;
        }
        // carto.height = 0;
        const destination = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
        const pitch = toRadians(map.getPitch());
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
        // const cameraPosition = map.pointToCoord(new maptalks.Coordinate(map.cameraPosition), map.getGLZoom());
        // const resolution = map.getResolution();
        // const distance = this._calcDistanceForResolution(
        //     // resolution || 0, toRadians(ll[1]));
        //     resolution, map);
        const distance = this._calcDistance(map);

        scene.camera.moveBackward(distance);
    }

    _calcDistance(map) {
        const canvas = this.canvas;
        const fovy = this.scene.camera.frustum.fov; // horizontal field of view

        const c = map.getCenter();
        const b = map.locateByPoint(c, canvas.width, 0);
        const requiredDistance = (map.computeLength(c, b) / 2) / Math.tan(fovy / 2);

        // const pitch = toRadians(map.getPitch());
        return requiredDistance;
    }

    _calcDistanceForResolution2(resolution, latitude) {
        const canvas = this.canvas;
        const fovy = this.scene.camera.frustum.fov; // vertical field of view
        const metersPerUnit = resolution;//2 * Math.PI * 6370997 / 360;

        // number of "map units" visible in 2D (vertically)
        const visibleMapUnits = canvas.width;

        // The metersPerUnit does not take latitude into account, but it should
        // be lower with increasing latitude -- we have to compensate.
        // In 3D it is not possible to maintain the resolution at more than one point,
        // so it only makes sense to use the latitude of the "target" point.
        const relativeCircumference = Math.cos(Math.abs(latitude));

        // how many meters should be visible in 3D
        const visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;

        // distance required to view the calculated length in meters
        //
        //  fovy/2
        //    |\
        //  x | \
        //    |--\
        // visibleMeters/2
        const requiredDistance = (visibleMeters / 2) / Math.tan(fovy / 2);

        // NOTE: This calculation is not absolutely precise, because metersPerUnit
        // is a great simplification. It does not take ellipsoid/terrain into account.

        return requiredDistance;
    }
}
CesiumLayer.registerRenderer('canvas', CeisumLayerRenderer);

function toRadians(d) {
    return d * Math.PI / 180;
}
