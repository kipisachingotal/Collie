// styled mui ListItemButton with on hover background change
import {styled} from "@mui/material/styles";
import {ListItemButton} from "@mui/material";

const StyledListItemButton = styled(ListItemButton)(({theme}) => ({
  color:"inherit",
  // '&:hover': {
  //   // color:"inherit",
  //   backgroundColor: 'lightgrey',
  // },
  // [theme.breakpoints.down('sm')]: {
  //   padding: 0,
  // }
}));

export default StyledListItemButton;