import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import githubSvg from './Github';
import signOutSvgPath from './SignOut';

const GithubIcon = (
  <SvgIcon viewBox={githubSvg.viewBox}>
    <path d={githubSvg.path} />
  </SvgIcon>
);

const SignOutIcon = (
  <SvgIcon>
    <path d={signOutSvgPath} />
  </SvgIcon>
);

export { GithubIcon, SignOutIcon };
