import { makeAutoObservable, runInAction } from "mobx";

interface User {
    _id: string;
    email: string;
    lastName: string;
    firstName: string;
    role: string;
}

export default class UserStore {
    private _isAuth: boolean = false;
    private _user: User = { _id: "", role: "", email: "", firstName: "", lastName: "" };

    constructor() {
        makeAutoObservable(this); // makeAutoObservable автоматически управляет реактивностью и actions
    }

    setIsAuth(bool: boolean) {
        runInAction(() => { // оборачиваем в runInAction

            this._isAuth = bool;
        });
    }

    resetUser() {
        runInAction(() => { // оборачиваем в runInAction
            this._isAuth = false;
            this._user = { _id: "", email: "", lastName: "", firstName: "", role: "" };
        });
        localStorage.setItem("token", "")
    }

    setUser(user: User) {
        runInAction(() => { // оборачиваем в runInAction

            this._user = user;
        });
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }
}
