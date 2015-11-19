/**
 * 程序入口
 */
module smallcanvas {
    export function init(dom?) {
        //smallcanvas.DOM.canvas=dom||document.querySelector('canvas');
        smallcanvas.mainLoop();
        return smallcanvas;
    }

    export function mainLoop() {
        smallcanvas.enterFrameHandle();
        bindEvent();
        render();
        window.requestAnimationFrame(smallcanvas.mainLoop)
    }

    export function render() {
        for (var index in smallcanvas.DisplayPool.DisplayHash) {
            var item = smallcanvas.DisplayPool.DisplayHash[index];
            smallcanvas.DOM.ctx.clearRect(0, 0, smallcanvas.DOM.canvas['offsetWidth'], smallcanvas.DOM.canvas['offsetHeight']);
            smallcanvas.DOM.ctx.drawImage(item.texture, item.offsetX, item.offsetY, item.offsetWidth, item.offsetHeight);
        }
    }

    export function bindEvent() {
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
            var touchArray = []
                , canvas = smallcanvas.DOM.canvas
                , event = window['event']
                ;
            if (event['offsetX']) {
                touchArray.push({
                    x: event['offsetX'] / canvas['offsetWidth'] * canvas['width'],
                    y: event['offsetY'] / canvas['offsetHeight'] * canvas['height']
                })
            } else {
                var touches = event['touches'];
                for (var i = 0; i < touches.length; i++) {
                    touchArray.push({
                        x: (touches[i]['clientX'] - canvas['offsetLeft']) / canvas['offsetWidth'] * canvas['width'],
                        y: (touches[i]['clientY'] - canvas['offsetTop']) / canvas['offsetHeight'] * canvas['height']
                    })
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
                })
            }
            return resultFunction;
        }


    }

    export function enterFrameHandle() {

    }

    export function defaultHandle() {
        console.log('这是默认事件');
    }

}