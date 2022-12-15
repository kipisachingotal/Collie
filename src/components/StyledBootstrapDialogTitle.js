import {styled} from "@mui/material/styles";
import BootstrapDialogTitle from "./BootstrapDialogTitle";
import PropTypes from "prop-types";

const StyledBootstrapDialogTitle = styled(BootstrapDialogTitle)(({theme}) => ({
  background: "#072227",
  color: "#AEFEFF",
}));

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
export default StyledBootstrapDialogTitle;