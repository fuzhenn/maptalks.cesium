import * as maptalks from 'maptalks';
import * as Cesium from 'Cesium';
import Mixins from './mixins';

class Cesium3DTileset extends maptalks.Eventable(Cesium.Cesium3DTileset) {

}
maptalks.Util.extend(Cesium3DTileset.prototype, Mixins);

export default Cesium3DTileset;
