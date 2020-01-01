import axios from 'axios';
import image from '../static/images/houses_beautiful_beach_photo_wallpaper.jpg';

const bingAxios = axios.create({
  timeout: 3300,
});

const defaultImage = {
  copyright: '默认背景',
  url: image,
};

/**
 * fetch Bing Image
 * @param {string} url proxy address
 */
export const getBingImage = async url => {
  url = url ||
        process.env.NODE_ENV === 'production'
          ? 'https://bing.fansaly.com'
          : 'http://localhost:3003';

  try {
    const { data } = await bingAxios.get(url);
    return data;
  } catch (e) {
    console.warn('Get Bing\'s image failed.');
    return {
      ...defaultImage,
      time: new Date().toISOString(),
    };
  }
};
