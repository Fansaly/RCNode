import axios from 'axios';
import image from '../static/images/houses_beautiful_beach_photo_wallpaper.jpg';

/**
 * fetch Bing Image
 * @param {string} url proxy address
 */
const getBingImage = url => {
  url = url || process.env.NODE_ENV === 'production'
                ? 'http://163.44.118.86:8080'
                : 'http://127.0.0.1:3001';

  const defaultData = {
    base: '',
    images: [{
      copyright: '默认背景',
      url: image,
    }],
  };

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(({ data }) => {
        resolve(data);
      }, (err) => {
        console.warn('Get Bing\'s image failed.');

        resolve(defaultData);
      });
  });
};

export { getBingImage };
