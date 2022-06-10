import axios from 'axios';

import imagea from '@/assets/images/aerial-view-of-bondi-beach-coast-australia-scaled-2560x1600-858.jpg';
import imageb from '@/assets/images/beautiful-beach-wallpaper-1920x1200-332.jpg';

const bingAxios = axios.create({
  timeout: 1000,
});

const defaultImage = {
  copyright: '默认背景',
  url: Math.random() > 0.6 ? imagea : imageb,
};

/**
 * fetch Bing Image
 * @param {string} url proxy address
 */
export const fetchBingImage = async ({
  url,
  signal,
}: {
  url?: string;
  signal?: AbortSignal;
}) => {
  url =
    url || import.meta.env.DEV ? 'http://localhost:3211' : 'https://bing._online_.com';

  try {
    const { data } = await bingAxios.get(url, { signal });
    return data;
  } catch {
    console.warn("Failed to fetch bing's image.");
    return {
      ...defaultImage,
      time: new Date().toISOString(),
    };
  }
};
