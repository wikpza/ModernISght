
export type InventorySessionType = 'adding' | 'buying' | 'returning'

function isInventorySessionType(value:any):value is InventorySessionType {
    return value === "adding" || value === "buying" || value === "returning"
}
export const toInventorySessionType = (unknownValue:any)=>{
    let type:InventorySessionType
    if(isInventorySessionType(unknownValue)){
        type = unknownValue
    }else{
        throw new Error('unknown type of inventory session')
    }
    return type
}