/**
 * 程序入口
 */
module smallcanvas {
    export function init(dom?) {
        //smallcanvas.DOM.canvas=dom||document.querySelector('canvas');
        return smallcanvas;
    }

    export function mainLoop(){
        render();
        smallcanvas.DOM.canvas.removeEventListener(smallcanvas.eventHandle);
        smallcanvas.eventHandle=function(){
            for (var disObjIndex in smallcanvas.DisplayPool.DisplayHash) {
                var disObj = smallcanvas.DisplayPool.DisplayHash[disObjIndex];
                disObj.eventPool
            }
        }
        smallcanvas.DOM.canvas.addEventListener(smallcanvas.eventHandle);
        window.requestAnimationFrame(smallcanvas.mainLoop)
    }

    export function render() {
        for (var disObjIndex in smallcanvas.DisplayPool.DisplayHash) {
            var disObj = smallcanvas.DisplayPool.DisplayHash[disObjIndex];
            smallcanvas.DOM.ctx.clearRect(0, 0, smallcanvas.DOM.canvas['offsetWidth'], smallcanvas.DOM.canvas['offsetHeight']);
            smallcanvas.DOM.ctx.drawImage(disObj.texture, disObj.offsetX, disObj.offsetY, disObj.offsetWidth, disObj.offsetHeight);
        }
    }

    export function eventHandle(){
        console.log('这是默认事件');
    }
}