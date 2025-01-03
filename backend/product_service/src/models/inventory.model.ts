
export class Inventory{
    constructor(
        public readonly sku:string,
        public readonly sizes:{[key:string]:number}
    ) {
    }

}