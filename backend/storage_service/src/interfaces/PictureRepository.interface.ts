export interface IPictureRepository{
    find(key:string):Promise<Buffer>
    delete(key:string):void
    add(input:{key:string, file:Buffer}):Promise<Buffer>
}