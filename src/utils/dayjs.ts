import dayjs from 'dayjs';
import locale from 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale(locale);
dayjs.extend(relativeTime);

export { dayjs };
