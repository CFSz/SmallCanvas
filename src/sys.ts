/**
 * 程序入口
 */
module sc {
    export function init(dom?) {
        //sc.DOM.canvas=dom||document.querySelector('canvas');
        render();
        return sc;
    }

    export function render() {
        for (var disObjIndex in sc.DisplayPool.DisplayHash) {
            var disObj = sc.DisplayPool.DisplayHash[disObjIndex];
            sc.DOM.ctx.clearRect(0, 0, sc.DOM.canvas['offsetWidth'], sc.DOM.canvas['offsetHeight']);
            sc.DOM.ctx.drawImage(disObj.texture, disObj.offsetX, disObj.offsetY, disObj.offsetWidth, disObj.offsetHeight);
        }
        window.requestAnimationFrame(sc.render)
    }
}