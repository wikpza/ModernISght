import {PictureRepository} from "../repositories/picture.repository";
import {IPictureRepository} from "../interfaces/PictureRepository.interface";

export class PictureService{
    private _repository:IPictureRepository
    constructor(repository:IPictureRepository) {
        this._repository = repository
    }

    async getPicture(key:string):Promise<Buffer>{
        return await this._repository.find(key)
    }
    async addPicture(input:{key:string, file:Buffer}):Promise<Buffer>{
        return await this._repository.add(input)
    }
    async deletePicture(key:string){
          this._repository.delete(key)
    }

}