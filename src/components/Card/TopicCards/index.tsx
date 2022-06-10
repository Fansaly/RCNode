import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';

import TopicCard from '../TopicCard';

const useStyles = makeStyles(() => ({
  margin: {
    marginTop: 20,
    '&:first-child': {
      marginTop: 0,
    },
    '@media (max-width: 768px)': {
      marginTop: 16,
    },
  },
}));

interface Props {
  className?: string;
  classes?: {
    [key: string]: string;
  };
  simple?: boolean;
  items: any[];
}

const TopicCards = ({
  className,
  classes = {},
  simple = false,
  items,
  ...rest
}: Props) => {
  const styles = useStyles();

  return (
    <div className={clsx(styles.margin, className, classes.root)} {...rest}>
      {items.map((item) => (
        <TopicCard
          className={clsx(classes.card)}
          simple={simple}
          item={item}
          key={item.id}
        />
      ))}
    </div>
  );
};

export default TopicCards;
