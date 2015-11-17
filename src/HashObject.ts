/**
 * 为对象提供一个唯一的标识码
 */
module smallcanvas {
    export class HashObject {
        public constructor() {
            this.hashCode = HashObject.hashCount++;
        }

        public hashCode;
        static hashCount = 1;
    }
}