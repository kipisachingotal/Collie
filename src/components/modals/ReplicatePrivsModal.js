import React, {useEffect, useState} from 'react';
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
import {useDispatch} from "react-redux";
import {setIsLoadingTree} from "../../redux/mainStore";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

function ReplicatePrivsModal({openReplicatePrivs,handleCloseReplicatePrivs,setOpenReplicatePrivs,allUsers}) {

    const [fromUser, setFromUser] = useState(null);
    const [toUser, setToUser] = useState(null);
    const dispatch = useDispatch();

    useEffect(()=>{
      console.log("all users are : ", allUsers )
    },[])

    const handleReplicatePrivsToUser = () =>{
      if (fromUser==null || toUser==null) {
        Swal.fire({
          title: "Please select From and To Users",
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
      else{  
        dispatch(setIsLoadingTree(true));
        console.log(`trying to replicate privileges of ${fromUser.value} to ${toUser.map(r=>r.value)}`)
        axios({
          method: 'post',
          url: `http://localhost:8888/replicate_priv_to_user/`,
          data: { 
            "userName":JSON.parse(localStorage.getItem('userCreds')).username,
            "password":JSON.parse(localStorage.getItem('userCreds')).password,
            "account":JSON.parse(localStorage.getItem('userCreds')).account,
            "data":[
              "SECURITYADMIN",toUser.map(r=>r.value),fromUser.value
            ]
          },
          headers: {
            // 'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })
        .then((response) => {
          console.log("replicate privileges response :", response);
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
          dispatch(setIsLoadingTree(false));

          // getWarehouses();
        })
        .catch((error) => {
          console.log(error)
          alert(error)
          alert("Could not replicate privileges")
          dispatch(setIsLoadingTree(false));
        })
        setOpenReplicatePrivs(false);
      }
    }

    return (
        <BootstrapDialog
            onClose={handleCloseReplicatePrivs}
            aria-labelledby="customized-dialog-title"
            open={openReplicatePrivs}
            PaperProps={{
                style: {
                  width:"750px", height:"750px"
                },
            }}
        >
            <StyledBootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseReplicatePrivs}>
                Replicate Privileges
            </StyledBootstrapDialogTitle>
            <DialogContent dividers>
              <div style={{display:"flex", justifyContent:"space-around",alignItems:"center"}}>
              <p style={{margin:"0px 4px"}}>Replicate Privileges of</p>
              <Select
                  placeholder="Select a User"
                  onChange={setFromUser}
                  options={allUsers.map(u=>{
                    return({"value":u["NAME"],"label":u["NAME"]})
                  })}
              />
              <p>To</p>
              <Select
                  isMulti
                  placeholder="Select a User"
                  onChange={setToUser}
                  options={allUsers.map(u=>{
                    return({"value":u["NAME"],"label":u["NAME"]})
                  })}
              />
              </div>
            </DialogContent>
            <DialogActions>
                <ModalStyledButton autoFocus onClick={handleCloseReplicatePrivs} type="cancel">
                Cancel
                </ModalStyledButton>
                <ModalStyledButton autoFocus onClick = {handleReplicatePrivsToUser} type="confirm">
                Replicate
                </ModalStyledButton>
            </DialogActions>
        </BootstrapDialog>
    )
}

export default ReplicatePrivsModal