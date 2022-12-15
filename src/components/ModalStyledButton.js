import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";

export const ModalStyledButton = styled(Button, {shouldForwardProp: (prop) => prop !== 'type'})(({theme, type}) => ({
  color: "white",
  ...(type === 'confirm' &&  {
    backgroundColor: "#072227",
  }),
  ...(type === 'cancel'  && {
    backgroundColor: "gray"
  }),
  '&:hover': {
    backgroundColor: 'black',
},
}));