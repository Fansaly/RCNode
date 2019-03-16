import axios from 'axios';
import image from '../static/images/houses_beautiful_beach_photo_wallpaper.jpg';

/**
 * fetch Bing Image
 * @param {string} url proxy address
 */
const getBingImage = url => {
  url = url ||
        process.env.NODE_ENV === 'production'
          ? 'https://bing.fansaly.com'
          : 'http://localhost:3003';

  const defaultData = {
    copyright: '默认背景',
    url: image,
  };

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(({ data }) => {
        resolve(data);
      }, (err) => {
        // eslint-disable-next-line
        console.warn('Get Bing\'s image failed.');

        resolve(defaultData);
      });
  });
};

export { getBingImage };
