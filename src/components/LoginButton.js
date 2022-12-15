import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";

const LoginButton = styled(Button)({
  marginLeft: 'auto',
  borderRadius: '2rem',
  borderColor: '#B3D842',
  backgroundColor: '#B3D842',
  color: '#151516',
  fontWeight: 'bold',
  width: '50%',
  height: '3rem',
  '&:hover': {
    backgroundColor: '#151516',
    borderColor: '#FEFFFE',
    color: '#FEFFFE',
  },
});

export default LoginButton;