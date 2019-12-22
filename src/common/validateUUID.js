import validate from 'uuid-validate';

/**
 * repo: https://github.com/cnodejs/nodeclub
 * file: proxy/user.js
 * line: 106
 */
const uuidVersion = 4;

export default (uuid) => {
  return validate(uuid, uuidVersion);
};
