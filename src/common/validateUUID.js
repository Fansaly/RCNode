import validate from 'uuid-validate';

/**
 * repo. https://github.com/cnodejs/nodeclub
 * file: nodeclub/proxy/user.js
 * line: 106
 * uuid.v4()
 */
const uuidVersion = 4;

export default (uuid) => {
  return validate(uuid, uuidVersion);
};
