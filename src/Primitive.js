
import * as maptalks from 'maptalks';
import * as Cesium from 'Cesium';
import Mixins from './mixins';

class Primitive extends maptalks.Eventable(Cesium.Primitive) {

}
maptalks.Util.extend(Primitive.prototype, Mixins);

export default Primitive;
