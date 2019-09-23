const ENDPOINT_URL = '';
const ENDPOINT_PORT = null;
const ENDPOINT_FULL = `${ENDPOINT_URL}${ENDPOINT_PORT ? `:${ENDPOINT_PORT}` : ''}`;

const ENDPOINT = {
  API: `${ENDPOINT_FULL}/api/v1`,
};

const CONFIG = {
  APP_NAME: 'Groupie',
  JWT_TOKEN: 'USER_TOKEN',
  BASE_URL: 'http://localhost:3000/',
  GG_CLIENT_ID: '757866579969-pgkie6cshr8vnfm30d40m8c9a3phu7jk.apps.googleusercontent.com',
};

export { ENDPOINT, CONFIG };