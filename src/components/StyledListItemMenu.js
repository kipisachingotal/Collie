// styled mui ListItemButton with on hover background change
import {styled} from "@mui/material/styles";
import {ListItem} from "@mui/material";

const StyledListItemMenu = styled(ListItem)(({theme}) => ({
  color:"inherit",
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.69)' : 'rgba(255,255,255,0.1)',
  },
  // '&:hover': {
  //   // color:"inherit",
  //   backgroundColor: 'lightgrey',
  // },
  // [theme.breakpoints.down('sm')]: {
  //   padding: 0,
  // }
}));

export default StyledListItemMenu;