// import { get, post } from './helper';
import { ENDPOINT } from '../Constants';

// const url = `${ENDPOINT.API}/groups`;

const Groups = {
  async all(params) {
    return [
        {id: 1, name: 'croneboys', description: 'lorem  ipsium'},
        {id: 2, name: 'croneguys', description: 'lorem  ipsium'},
        {id: 3, name: 'cronesisters', description: 'lorem  ipsium'},
        {id: 4, name: 'cronemen', description: 'lorem  ipsium'}
    ];//get(url, params);
  },

  async create(values) {
      return {id: 5, name: 'cronedudes', description: 'lorem  ipsium'};//post(url, values);
  },

  async member(email) {
    return {status: true, message: 'mail sent to user'}
  }
};

export default Groups;
