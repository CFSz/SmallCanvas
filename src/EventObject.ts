/**
 * 事件池
 */
module smallcanvas {
    export class EventObject extends smallcanvas.HashObject {
        public constructor(options) {
            super();
            //options = options || {};
            //EventObject.eventPool[this.hashCode]=options;
            this.target = options.target;
            this.type = options.type;
            this.successHandle = options.successHandle;
            this.failHandle = options.failHandle;
        }

        public target;
        public type;
        public successHandle;
        public failHandle;

        public remove() {
            delete EventObject.eventPool[this.hashCode];
        }

        public static eventPool = {};
        public static DOMEventHandle = {};
    }
}