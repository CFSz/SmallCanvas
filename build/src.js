/**
 * 为对象提供一个唯一的标识码
 */
var smallcanvas;
(function (smallcanvas) {
    var HashObject = (function () {
        function HashObject() {
            this.hashCode = HashObject.hashCount++;
        }
        HashObject.hashCount = 1;
        return HashObject;
    })();
    smallcanvas.HashObject = HashObject;
})(smallcanvas || (smallcanvas = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 事件池
 */
var smallcanvas;
(function (smallcanvas) {
    var EventObject = (function (_super) {
        __extends(EventObject, _super);
        function EventObject(options) {
            _super.call(this);
            //options = options || {};
            //EventObject.eventPool[this.hashCode]=options;
            this.target = options.target;
            this.type = options.type;
            this.successHandle = options.successHandle;
            this.failHandle = options.failHandle;
        }
        EventObject.prototype.remove = function () {
            delete EventObject.eventPool[this.hashCode];
        };
        EventObject.eventPool = {};
        EventObject.DOMEventHandle = {};
        return EventObject;
    })(smallcanvas.HashObject);
    smallcanvas.EventObject = EventObject;
})(smallcanvas || (smallcanvas = {}));
/**
 * DOM
 */
var smallcanvas;
(function (smallcanvas) {
    var DOM = (function () {
        function DOM() {
        }
        Object.defineProperty(DOM, "canvas", {
            get: function () {
                return DOM._canvas;
            },
            set: function (dom) {
                DOM.ctx = dom['getContext']('2d');
            },
            enumerable: true,
            configurable: true
        });
        DOM._canvas = document.querySelector('canvas') || document.createElement('canvas');
        DOM.ctx = DOM._canvas['getContext']('2d');
        return DOM;
    })();
    smallcanvas.DOM = DOM;
})(smallcanvas || (smallcanvas = {}));
/**
 * 以图片为基础的显示对象
 */
/// <reference path="HashObject.ts" />
/// <reference path="EventObject.ts" />
/// <reference path="DOM.ts" />
var smallcanvas;
(function (smallcanvas) {
    var DisplayObject = (function (_super) {
        __extends(DisplayObject, _super);
        /**
         * 显示对象,构建世界的基础
         * @param canvas canvasDOM
         * @param src 资源地址
         * @param x 目标坐标x
         * @param y 目标坐标y
         * @param width 目标宽度
         * @param height 目标高度
         * @param anchorX 锚点X
         * @param anchorY 锚点Y
         * @param scale 缩放倍数
         */
        function DisplayObject(options) {
            _super.call(this);
            this.scale = 1;
            this.eventPool = {};
            options = options || {};
            this.texture = new Image();
            this.texture.src = options.src || 'images/error.png';
            this.texture.onload = this.textureLoadHandle.bind(this);
            this.texture["ready"] = false;
            this.x = options.x || 0;
            this.y = options.y || 0;
            this.width = options.width || 0;
            this.height = options.height || 0;
            this.anchorX = options.anchorX || 0;
            this.anchorY = options.anchorY || 0;
            this.scale = options.scale || 1;
            this.init();
        }
        /**
         * 初始化
         */
        DisplayObject.prototype.init = function () {
            //            this.eventPoolHash=smallWheel.ads;
            this.appendToStage();
        };
        Object.defineProperty(DisplayObject.prototype, "offsetWidth", {
            /**
             * 实际宽度
             * @returns {number}
             */
            get: function () {
                return this.width * this.scale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "offsetHeight", {
            /**
             * 实际高度
             * @returns {number}
             */
            get: function () {
                return this.width * this.scale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "offsetX", {
            /**
             * 实际x
             * @returns {number}
             */
            get: function () {
                return this.x - this.width * this.anchorX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "offsetY", {
            /**
             * 实际y
             * @returns {number}
             */
            get: function () {
                return this.y - this.height * this.anchorY;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 处理资源加载完成事件
         */
        DisplayObject.prototype.textureLoadHandle = function () {
            this.texture["ready"] = true;
            this.width = this.texture.width;
            this.height = this.texture.height;
        };
        /**
         * 绑定时间
         * @param type 事件类型
         * @param successHandle 判定成功的事件处理
         * @param failHandle 判定失败的事件处理
         */
        DisplayObject.prototype.addEventListener = function (type, successHandle, failHandle) {
            var self = this;
            var event = new smallcanvas.EventObject({
                target: this,
                //x: self.offsetX,
                //y: self.offsetY,
                //width: self.offsetWidth,
                //height: self.offsetHeight,
                type: type,
                successHandle: successHandle || smallcanvas.defaultHandle,
                failHandle: failHandle || smallcanvas.defaultHandle
            });
            this.eventPool[type + successHandle + failHandle] = event;
        };
        DisplayObject.prototype.removeEventListener = function (type, successHandle, failHandle) {
            delete this.eventPool[type + successHandle + failHandle];
        };
        /**
         * 绘制显示对象
         */
        DisplayObject.prototype.appendToStage = function () {
            smallcanvas.DisplayPool.DisplayHash[this.hashCode] = this;
        };
        return DisplayObject;
    })(smallcanvas.HashObject);
    smallcanvas.DisplayObject = DisplayObject;
})(smallcanvas || (smallcanvas = {}));
/**
 * 显示对象池
 */
var smallcanvas;
(function (smallcanvas) {
    var DisplayPool = (function () {
        function DisplayPool() {
        }
        DisplayPool.DisplayHash = {};
        return DisplayPool;
    })();
    smallcanvas.DisplayPool = DisplayPool;
})(smallcanvas || (smallcanvas = {}));
/**
 * 程序入口
 */
var smallcanvas;
(function (smallcanvas) {
    function init(dom) {
        //smallcanvas.DOM.canvas=dom||document.querySelector('canvas');
        smallcanvas.mainLoop();
        return smallcanvas;
    }
    smallcanvas.init = init;
    function mainLoop() {
        smallcanvas.enterFrameHandle();
        bindEvent();
        render();
        window.requestAnimationFrame(smallcanvas.mainLoop);
    }
    smallcanvas.mainLoop = mainLoop;
    function render() {
        for (var index in smallcanvas.DisplayPool.DisplayHash) {
            var item = smallcanvas.DisplayPool.DisplayHash[index];
            smallcanvas.DOM.ctx.clearRect(0, 0, smallcanvas.DOM.canvas['offsetWidth'], smallcanvas.DOM.canvas['offsetHeight']);
            smallcanvas.DOM.ctx.drawImage(item.texture, item.offsetX, item.offsetY, item.offsetWidth, item.offsetHeight);
        }
    }
    smallcanvas.render = render;
    function bindEvent() {
        var eventTypeHash = {};
        var EventObject = smallcanvas.EventObject;
        /**
         * 遍历显示对象,获得全部需要处理的Event
         * 并根据type分组暂存至eventTypeHash
         */
        for (var index in smallcanvas.DisplayPool.DisplayHash) {
            var item = smallcanvas.DisplayPool.DisplayHash[index];
            for (var cIndex in item.eventPool) {
                var cItem = item.eventPool[cIndex];
                eventTypeHash[cItem.type] || (eventTypeHash[cItem.type] = []);
                eventTypeHash[cItem.type].push({
                    x: cItem.target.x,
                    y: cItem.target.y,
                    width: cItem.target.offsetWidth,
                    height: cItem.target.offsetHeight,
                    successHandle: cItem.successHandle,
                    failHandle: cItem.failHandle
                });
            }
        }
        /**
         * 将一类事件拼接为一个处理器,并绑定至DOM
         */
        for (var type in eventTypeHash) {
            var eventArray = eventTypeHash[type];
            EventObject.DOMEventHandle[type] && smallcanvas.DOM.canvas.removeEventListener(type, EventObject.DOMEventHandle[type], false);
            EventObject.DOMEventHandle[type] = createDomEventHandle(eventArray);
            smallcanvas.DOM.canvas.addEventListener(type, EventObject.DOMEventHandle[type], false);
        }
        /**
         * 使单点触控,多点触控返回统一的数据
         * @returns {Array}
         */
        function getTouchPosition() {
            var touchArray = [], canvas = smallcanvas.DOM.canvas, event = window['event'];
            if (event['offsetX']) {
                touchArray.push({
                    x: event['offsetX'] / canvas['offsetWidth'] * canvas['width'],
                    y: event['offsetY'] / canvas['offsetHeight'] * canvas['height']
                });
            }
            else {
                var touches = event['touches'];
                for (var i = 0; i < touches.length; i++) {
                    touchArray.push({
                        x: (touches[i]['clientX'] - canvas['offsetLeft']) / canvas['offsetWidth'] * canvas['width'],
                        y: (touches[i]['clientY'] - canvas['offsetTop']) / canvas['offsetHeight'] * canvas['height']
                    });
                }
            }
            return touchArray;
        }
        /**
         * 生成DOM事件处理函数
         * @param eventArray
         * @returns {function(): undefined}
         */
        function createDomEventHandle(eventArray) {
            var resultFunction = function () {
                var touchPosArray = getTouchPosition();
                eventArray.forEach(function (item) {
                    var isSuccess;
                    touchPosArray.forEach(function (touchPos) {
                        if (touchPos.x > item.x && touchPos.x < (item.x + item.width) && touchPos.y > item.y && touchPos.y < (item.y + item.height)) {
                            isSuccess = true;
                        }
                    });
                    isSuccess ? item.successHandle() : item.failHandle();
                });
            };
            return resultFunction;
        }
    }
    smallcanvas.bindEvent = bindEvent;
    function enterFrameHandle() {
    }

    smallcanvas.enterFrameHandle = enterFrameHandle;
    function defaultHandle() {
        console.log('这是默认事件');
    }
    smallcanvas.defaultHandle = defaultHandle;
})(smallcanvas || (smallcanvas = {}));

//# sourceMappingURL=src.js.map
