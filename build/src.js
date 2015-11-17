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
/**
 * 事件池
 */
var smallcanvas;
(function (smallcanvas) {
    var EventPool = (function () {
        function EventPool() {
        }
        EventPool.eventPool = {};
        return EventPool;
    })();
    smallcanvas.EventPool = EventPool;
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 以图片为基础的显示对象
 */
/// <reference path="HashObject.ts" />
/// <reference path="EventPool.ts" />
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
            this.eventPool[type] || (this.eventPool[type] = []);
            this.eventPool[type].push({
                x: self.offsetX,
                y: self.offsetY,
                width: self.offsetWidth,
                height: self.offsetHeight,
                type: type,
                successHandle: successHandle,
                failHandle: failHandle
            });
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
        render();
        return smallcanvas;
    }
    smallcanvas.init = init;
    function render() {
        for (var disObjIndex in smallcanvas.DisplayPool.DisplayHash) {
            var disObj = smallcanvas.DisplayPool.DisplayHash[disObjIndex];
            smallcanvas.DOM.ctx.clearRect(0, 0, smallcanvas.DOM.canvas['offsetWidth'], smallcanvas.DOM.canvas['offsetHeight']);
            smallcanvas.DOM.ctx.drawImage(disObj.texture, disObj.offsetX, disObj.offsetY, disObj.offsetWidth, disObj.offsetHeight);
        }
        window.requestAnimationFrame(smallcanvas.render);
    }
    smallcanvas.render = render;
})(smallcanvas || (smallcanvas = {}));

//# sourceMappingURL=src.js.map
