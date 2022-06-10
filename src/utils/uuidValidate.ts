import { validate as uuidValidate, version as uuidVersion } from 'uuid';

// https://github.com/cnodejs/nodeclub/blob/master/proxy/user.js#L106
const version = 4;

export const validate = (uuid: string) => {
  return uuidValidate(uuid) && uuidVersion(uuid) === version;
};

export { validate as uuidValidate };
