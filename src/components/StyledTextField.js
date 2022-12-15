import {styled} from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#FEFFFE',
  },
  "& .MuiFormLabel-root": {
    color: '#8B8A8B',
  },
  '& .MuiInputRoot-input': {
    color: '#FEFFFE',
  },
  '& .MuiOutlinedInput-root': {
    color: '#FEFFFE',
    '& fieldset': {
      borderBottomColor: '#8B8A8B',
      color: '#8B8A8B',
    },
    '& .MuiInput-helper-text': {
      color: '#8B8A8B',
    },
    '&:hover fieldset': {
      borderBottomColor: '#FEFFFE',
    },
    '&.Mui-focused fieldset': {
      borderBottomColor: '#FEFFFE',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderRadius: 0,
    },
  },
});

export default StyledTextField;