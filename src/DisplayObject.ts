/**
 * 以图片为基础的显示对象
 */
/// <reference path="HashObject.ts" />
/// <reference path="EventPool.ts" />
/// <reference path="DOM.ts" />
module sc {
    export class DisplayObject extends sc.HashObject {
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
        public constructor(options) {
            super();
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


        public texture;//图片素材
        public x;//坐标x
        public y;//坐标y
        public width;//宽度
        public height;//高度
        public anchorX;//X偏移倍数
        public anchorY;//Y偏移倍数
        public scale = 1;
        public eventPool = {};


        /**
         * 初始化
         */
        private init() {
//            this.eventPoolHash=smallWheel.ads;
            this.appendToStage();
        }

        /**
         * 实际宽度
         * @returns {number}
         */
        public get offsetWidth() {
            return this.width * this.scale;
        }

        /**
         * 实际高度
         * @returns {number}
         */
        public get offsetHeight() {
            return this.width * this.scale;
        }

        /**
         * 实际x
         * @returns {number}
         */
        public get offsetX() {
            return this.x - this.width * this.anchorX;
        }

        /**
         * 实际y
         * @returns {number}
         */
        public get offsetY() {
            return this.y - this.height * this.anchorY;
        }

        /**
         * 处理资源加载完成事件
         */
        private textureLoadHandle() {
            this.texture["ready"] = true;
            this.width = this.texture.width;
            this.height = this.texture.height;
        }


        /**
         * 绑定时间
         * @param type 事件类型
         * @param successHandle 判定成功的事件处理
         * @param failHandle 判定失败的事件处理
         */
        public addEventListener(type, successHandle, failHandle) {
            var self = this;
            this.eventPool[type] || (this.eventPool[type] = []);
            this.eventPool[type].push(
                {
                    x: self.offsetX,
                    y: self.offsetY,
                    width: self.offsetWidth,
                    height: self.offsetHeight,
                    type: type,
                    successHandle: successHandle,
                    failHandle: failHandle
                }
            );
        }

        /**
         * 绘制显示对象
         */
        public appendToStage() {
            sc.DisplayPool.DisplayHash[this.hashCode] = this;
        }

    }
}