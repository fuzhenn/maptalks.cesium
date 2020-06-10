
import * as maptalks from 'maptalks';

const Mixins = {

    getCenter() {
        return null;
    },

    getMap() {
        const layer = this._layer;
        if (layer) {
            return layer.getMap();
        }
        return null;
    },


    setInfoWindow(options) {
        this.infoWindow = new maptalks.ui.InfoWindow(options);
        return this;
    },

    getInfoWindow() {
        return this.infoWindow;
    },

    openInfoWindow(coordinate) {
        // eslint-disable-next-line no-unused-expressions
        (coordinate && this.infoWindow && this.infoWindow.show(coordinate));
        return this;
    },

    closeInfoWindow() {
        // eslint-disable-next-line no-unused-expressions
        (this.infoWindow && this.infoWindow.hide());
        return this;
    },


    removeInfoWindow() {
        // eslint-disable-next-line no-unused-expressions
        (this.infoWindow && this.infoWindow.remove() && (delete this.infoWindow));
        return this;
    },

    setToolTip(content, options) {
        this.toolTip = new maptalks.ui.ToolTip(content, options);
        return this;
    },

    getToolTip() {
        return this.toolTip;
    },

    openToolTip(coordinate) {
        // eslint-disable-next-line no-unused-expressions
        (coordinate && this.toolTip && this.toolTip.show(coordinate));
        return this;
    },

    closeToolTip() {
        // eslint-disable-next-line no-unused-expressions
        (this.toolTip && this.toolTip.hide());
        return this;
    },

    removeToolTip() {
        // eslint-disable-next-line no-unused-expressions
        (this.toolTip && this.toolTip.remove() && (delete this.toolTip));
        return this;
    }
};

export default Mixins;
