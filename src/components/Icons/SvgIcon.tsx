import MuiSvgIcon from '@mui/material/SvgIcon';

const SvgIcon = ({ viewBox, path }: { viewBox: string; path: string }) => {
  return (
    <MuiSvgIcon viewBox={viewBox}>
      <path d={path} />
    </MuiSvgIcon>
  );
};

export default SvgIcon;
