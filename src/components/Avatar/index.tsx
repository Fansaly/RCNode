import MuiAvatar from '@mui/material/Avatar';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';

import { PersonSearchIcon } from '@/components/Icons';

const useStyles = makeStyles((theme) => ({
  avatar: {
    '& a': {
      display: 'flex',
    },
    '& img': {
      display: 'inline-flex',
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: 12,
      lineHeight: 0,
      textIndent: 20,
    },
    '& svg': {
      width: '100%',
      height: '100%',
      color: theme.palette.text.primary,
      opacity: 0.8,
    },
  },
}));

interface RealAvatarProps {
  name?: string;
  image?: string;
}

const RealAvatar = ({ image, name }: RealAvatarProps) => {
  return image || name ? (
    <img src={image} alt={name || '用户已注销'} />
  ) : (
    <PersonSearchIcon />
  );
};

interface Props extends RealAvatarProps {
  className?: string;
  url?: string;
}

const Avatar = ({ className, name, image, url }: Props) => {
  const classes = useStyles();

  return (
    <MuiAvatar className={clsx(classes.avatar, className)}>
      {url ? (
        <Link to={name ? url : '/'}>
          <RealAvatar name={name} image={image} />
        </Link>
      ) : (
        <a>
          <RealAvatar name={name} image={image} />
        </a>
      )}
    </MuiAvatar>
  );
};

export default Avatar;
