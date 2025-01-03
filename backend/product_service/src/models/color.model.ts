import mongoose from "mongoose";

export class Color{
    constructor(
        public readonly name:string,
        public readonly hexCode:string,
    ) {
    }
}