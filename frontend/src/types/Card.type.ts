export type getCards = {
    userId:string,
    cards:getCard[],

}

export type getCard = {
    number:string,
    cvv:string,
    expiryDate:string,
    _id:string
}

export type CreateCard = {
    number:string,
    cvv:string,
    expiryDate:string,
}

