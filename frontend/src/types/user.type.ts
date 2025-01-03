export type User = {
    _id: string,
    lastName:string,
    firstName:string,
    email:string,
    role:string,
}

export type GetUserCount = {
    count:number,
    date:string,
}

export type UserInfo = {
    firstName:string,
    lastName:string,
    role:string,
    active:boolean,
    _id:string,
    email:string,
    createdAt:string,
    phoneNumber:string,
}

export type UserSession = {
    _id: string,
    email:string,
    type:string,
    createdAt:string
}

export type UserRegistration =  {
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    sentInfo:boolean,
    confirmedRules:boolean
}

export type UserLogIn = {
    email:string,
    password:string
}

export type Employer = {
    _id: string,
    lastName:string,
    firstName:string,
    email:string,
    role:string,
    phoneNumber:string
}

export type GetEmployer = {
    user:Employer[],
    totalPage:number
}

export type GetUserStatic ={
    userNumber:number,
    adminNumber:number,
    employerNumber:number
    unVerifyUser:number
}