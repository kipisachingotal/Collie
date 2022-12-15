import React, {useState} from 'react';
import { useDispatch,useSelector } from "react-redux";
import { setIsLoadingTree } from "../../redux/mainStore";
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import StyledBootstrapDialogTitle from "../StyledBootstrapDialogTitle";
import Typography from '@mui/material/Typography';
import {ModalStyledButton} from "../ModalStyledButton";
import Select from 'react-select';
import Swal from 'sweetalert2'
import axios from "axios"

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

function DropRoleModal({openDropRole, setOpenDropRole, handleCloseDropRole, allNodes,getAllNodes,getDisconnectedNodes,getNodes}) {

    const { isLoadingTree } = useSelector(state => state.mainSlice);
    const dispatch = useDispatch();
    const [roleRemoveName, setRoleRemoveName] = useState(null);

    const handleDropRole = () => {
        if (roleRemoveName.value.length > 0) {
          console.log("Dropping the role : ",roleRemoveName.value)
          dispatch(setIsLoadingTree(true));
          axios({
            method: 'post',
            url: `https://ww6g8cugsl.execute-api.ap-south-1.amazonaws.com/dev/drop_role/`,
            data: { 
              "userName":JSON.parse(localStorage.getItem('userCreds')).username,
              "password":JSON.parse(localStorage.getItem('userCreds')).password,
              "account":JSON.parse(localStorage.getItem('userCreds')).account,
              "data":["SECURITYADMIN",roleRemoveName.value,0]
            },
            headers: {
              // 'Authorization': `bearer ${token}`,
              'Content-Type': 'application/json'
            },
          })
          .then((response) => {
            console.log("Drop role response :", response.data);
            if(response.data.response==`WARNING: Role ${roleRemoveName.value} has dependencies, please revoke the dependencies before dropping the role!`){
              dispatch(setIsLoadingTree(false));
              var confirmDelete = window.confirm(`Role ${roleRemoveName.value} has dependencies! Do you still want to drop it?`)
              if(confirmDelete){
                dispatch(setIsLoadingTree(true));
                axios({
                  method: 'post',
                  url: `https://ww6g8cugsl.execute-api.ap-south-1.amazonaws.com/dev/drop_role/`,
                  data: {
                    "userName":JSON.parse(localStorage.getItem('userCreds')).username,
                    "password":JSON.parse(localStorage.getItem('userCreds')).password,
                    "account":JSON.parse(localStorage.getItem('userCreds')).account, 
                    "data":["SECURITYADMIN",roleRemoveName.value,1]
                  }
                  ,
                  headers: {
                    // 'Authorization': `bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                })
                .then((res)=>{
                  Swal.fire({
                    title: res.data.response,
                    customClass: 'swal_alert__box',
                    position:"center",
                    icon: response.data.flag==1?'success':'error',
                    confirmButtonText: 'Okay',
                    timer:'2000',
                    timerProgressBar:true,
                    didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer)
                      toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                  })
                  if(res.data.flag==1){
                    Promise.allSettled([getNodes(),getAllNodes(),getDisconnectedNodes()]).then((values) => {
                      dispatch(setIsLoadingTree(false));
                    });
                    setOpenDropRole(false);
                  }
                  else{
                    console.log(res.data.response)
                    dispatch(setIsLoadingTree(false));
                  }
                })
                .catch((err)=>{
                  dispatch(setIsLoadingTree(false));
                  console.log(err)
                  alert(err)
                  alert("Role Drop failed")
                })
              }
              else{
                console.log("Role drop cancelled")
              }
            }
            else{
                Swal.fire({
                  title: response.data.response,
                  customClass: 'swal_alert__box',
                  position:"center",
                  icon: response.data.flag==1?'success':'error',
                  confirmButtonText: 'Okay',
                  timer:'2000',
                  timerProgressBar:true,
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                  }
                })
                if(response.data.flag==1){
                  Promise.allSettled([getNodes(),getAllNodes(),getDisconnectedNodes()]).then((values) => {
                    dispatch(setIsLoadingTree(false));
                  });
                  setOpenDropRole(false);
                }
                else{
                  console.log(response.data.response)
                  dispatch(setIsLoadingTree(false));
                }
            }
          })
          .catch((error) => {
            dispatch(setIsLoadingTree(false));
            console.log("Role Drop failed due to :",error)
            alert("Role Drop failed")
          })
        }
        else {
          Swal.fire({
            title: "Please select a Role",
            customClass: 'swal_alert__box',
            position:"center",
            icon: 'error',
            confirmButtonText: 'Okay',
            timer:'2000',
            timerProgressBar:true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
        }
      }; 

    return (
        <BootstrapDialog
            onClose={handleCloseDropRole}
            aria-labelledby="customized-dialog-title"
            open={openDropRole}
            PaperProps={{
                style: {
                  width:"750px", height:"750px"
                },
            }}
        >
            <StyledBootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseDropRole}>
                Drop Role
            </StyledBootstrapDialogTitle>
            <DialogContent dividers>
                <div style={{padding:"0px 56px"}}>
                <div style={{alignItems:"center" ,margin:"12px"}}><div>
                    <p>Select Role to drop : </p>
                    <Select
                    defaultValue={roleRemoveName}
                    onChange={setRoleRemoveName}
                    options={allNodes.map(node => (node))}
                    />
                </div>

                </div>
                </div>
            </DialogContent>
            <DialogActions>
                <ModalStyledButton autoFocus onClick={handleCloseDropRole} type="cancel">
                Cancel
                </ModalStyledButton>
                <ModalStyledButton autoFocus onClick = {handleDropRole} type="confirm">
                Drop
                </ModalStyledButton>
            </DialogActions>
        </BootstrapDialog>
    )
}

export default DropRoleModal