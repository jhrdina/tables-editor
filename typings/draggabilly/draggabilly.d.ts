declare module draggabilly {
    export class Draggabilly {
        x: number;
        y: number;

        constructor(node: Node, options?: Options);
        constructor(selector: string, options?: Options);

        disable(): void;
        enable(): void;
        destroy(): void;

        on(type: "dragStart",   listener: (ev: MouseEvent | TouchEvent, pointer: MouseEvent | Touch) => any): any;
        on(type: "dragMove",    listener: (ev: MouseEvent | TouchEvent, pointer: MouseEvent | Touch, moveVector: any) => any): any;
        on(type: "dragEnd",     listener: (ev: MouseEvent | TouchEvent, pointer: MouseEvent | Touch) => any): any;
        on(type: "pointerDown", listener: (ev: MouseEvent | TouchEvent, pointer: MouseEvent | Touch) => any): any;
        on(type: "pointerMove", listener: (ev: MouseEvent | TouchEvent, pointer: MouseEvent | Touch, moveVector: any) => any): any;
        on(type: "pointerUp",   listener: (ev: MouseEvent | TouchEvent, pointer: MouseEvent | Touch) => any): any;
        on(type: "staticClick", listener: (ev: MouseEvent | TouchEvent, pointer: MouseEvent | Touch) => any): any;
        on(type: string,        listener: (...params: any[]) => any): any;
        off(type: string,       listener: (...params: any[]) => any): any;
        once(type: string,      listener: (...params: any[]) => any): any;
    }

    interface Options {
        axis?: string;
        containment?: Node | string | boolean;
        grid?: number[];
        handle?: string;
    }
}
import Draggabilly = draggabilly.Draggabilly;

declare module "draggabilly" {
    import Draggabilly = draggabilly.Draggabilly;
    export = Draggabilly;
}
