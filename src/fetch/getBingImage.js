import axios from 'axios';
import image from '../static/images/houses_beautiful_beach_photo_wallpaper.jpg';

/**
 * fetch Bing Image
 * @param {string} url proxy address
 */
const getBingImage = async url => {
  url = url ||
        process.env.NODE_ENV === 'production'
          ? 'https://bing.fansaly.com'
          : 'http://localhost:3003';

  const defaultData = {
    copyright: '默认背景',
    url: image,
    time: (new Date()).getTime(),
  };

  try {
    const { data } = await axios.get(url);
    return data;
  } catch (e) {
    console.warn('Get Bing\'s image failed.');
    return defaultData;
  }
};

export { getBingImage };
