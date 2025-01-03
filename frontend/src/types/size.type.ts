export type GetSizes= {
    _id:string,
    genderId:{
        _id:string,
        name:string
    },
    categoryId:{
        _id:string,
        name:string
    },
    sizes: Size[]
}

export type CreateSize = {
    genderId:string,
    categoryId:string,
    values: Size[]
}

export type Size ={
    _id:string,
    size:string
}


export type Sizes = {
    _id:string,
    genderId:string,
    categoryId:string,
    sizes: Size[]
}
