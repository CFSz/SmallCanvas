/**
 * 为对象提供一个唯一的标识码
 */
var sc;
(function (sc) {
    var HashObject = (function () {
        function HashObject() {
            this.hashCode = HashObject.hashCount++;
        }

        HashObject.hashCount = 1;
        return HashObject;
    })();
    sc.HashObject = HashObject;
})(sc || (sc = {}));
/**
 * 事件池
 */
var sc;
(function (sc) {
    var EventPool = (function () {
        function EventPool() {
        }

        EventPool.eventPool = {};
        return EventPool;
    })();
    sc.EventPool = EventPool;
})(sc || (sc = {}));
/**
 * DOM
 */
var sc;
(function (sc) {
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
    sc.DOM = DOM;
})(sc || (sc = {}));
var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
/**
 * 以图片为基础的显示对象
 */
/// <reference path="HashObject.ts" />
/// <reference path="EventPool.ts" />
/// <reference path="DOM.ts" />
var sc;
(function (sc) {
    var DisplayObject = (function (_super) {
        __extends(DisplayObject, _super);
        /**
         * 显示对象,构建世界的基础
         * @param canvas canvasDOM
         * @param textureSrc 资源地址
         * @param x 目标坐标x
         * @param y 目标坐标y
         * @param width 目标宽度
         * @param height 目标高度
         * @param anchorX 锚点X
         * @param anchorY 锚点Y
         */
        function DisplayObject(options) {
            _super.call(this);
            this.scale = 1;
            this.eventPool = {};
            options = options || {};
            this.texture = new Image();
            this.texture.src = options.textureSrc || 'images/error.png';
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
            sc.DisplayPool.DisplayHash[this.hashCode] = this;
        };
        return DisplayObject;
    })(sc.HashObject);
    sc.DisplayObject = DisplayObject;
})(sc || (sc = {}));
/**
 * 显示对象池
 */
var sc;
(function (sc) {
    var DisplayPool = (function () {
        function DisplayPool() {
        }

        DisplayPool.DisplayHash = {};
        return DisplayPool;
    })();
    sc.DisplayPool = DisplayPool;
})(sc || (sc = {}));
/**
 * 程序入口
 */
var sc;
(function (sc) {
    function init(dom) {
        //sc.DOM.canvas=dom||document.querySelector('canvas');
        render();
        return sc;
    }

    sc.init = init;
    function render() {
        for (var disObjIndex in sc.DisplayPool.DisplayHash) {
            var disObj = sc.DisplayPool.DisplayHash[disObjIndex];
            sc.DOM.ctx.clearRect(0, 0, sc.DOM.canvas.offsetWidth, sc.DOM.canvas.offsetHeight);
            sc.DOM.ctx.drawImage(disObj.texture, disObj.offsetX, disObj.offsetY, disObj.offsetWidth, disObj.offsetHeight);
        }
        window.requestAnimationFrame(sc.render);
    }

    sc.render = render;
})(sc || (sc = {}));

//# sourceMappingURL=src.js.map
