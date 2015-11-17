/**
 * DOM
 */
module sc {
    export class DOM {
        public static _canvas = document.querySelector('canvas') || document.createElement('canvas');
        public static ctx = DOM._canvas['getContext']('2d');

        public static set canvas(dom) {
            DOM.ctx = dom['getContext']('2d');
        }

        public static get canvas() {
            return DOM._canvas;
        }
    }
}