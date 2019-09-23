// import { post } from './helper';
import { ENDPOINT } from '../Constants';

// const url = `${ENDPOINT.API}/auth`;

const Auth = {
  async login(token) {
    return token;//post(`${url}/login`, token);
  },

  async invite(token, groupId){
    return token;
  }
};

export default Auth;
