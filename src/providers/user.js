import { CONFIG } from '../Constants';

const store = require('store');
class User{

    constructor(){
        this.token = store.get(CONFIG.JWT_TOKEN);
    }

    setToken(token){
        store.set(CONFIG.JWT_TOKEN, token);
        this.token = token;
    }

    getToken(){
        return this.token;
    }

    isLoggedIn(){
        const token = store.get(CONFIG.JWT_TOKEN);
        return token? true: false;
    }

    logout() {
        store.clearAll();
    }
}

export default (new User());