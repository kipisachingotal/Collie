import React,{useState} from 'react';
import { useDispatch,useSelector } from "react-redux";
import { setIsLoadingTree } from "../../redux/mainStore";
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import StyledBootstrapDialogTitle from "../StyledBootstrapDialogTitle";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import {ModalStyledButton} from "../ModalStyledButton";
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

function CreateUserModal({openAddUser,setOpenAddUser,handleCloseAddUser,getUsers}) {

    const dispatch = useDispatch(); 
    const [userName, setUserName] = useState("");
    const [userLoginName, setUserLoginName] = useState("");

    const handleAddUser = () => {
        if (userName.length > 0 && userLoginName.length > 0) {
            dispatch(setIsLoadingTree(true));
            console.log("Adding the user")
            axios({
                method: 'post',
                url: `https://ww6g8cugsl.execute-api.ap-south-1.amazonaws.com/dev/create_user/`,
                data: { 
                    "userName":JSON.parse(localStorage.getItem('userCreds')).username,
                    "password":JSON.parse(localStorage.getItem('userCreds')).password,
                    "account":JSON.parse(localStorage.getItem('userCreds')).account,
                    "data":[
                        "SECURITYADMIN",
                        userName,
                        userLoginName,
                    ]
                },
                headers: {
                    // 'Authorization': `bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => {
                console.log("Create user response :", response);
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
                    getUsers().then(()=> {
                        dispatch(setIsLoadingTree(false));
                    });
                }
                else {
                    dispatch(setIsLoadingTree(false));
                }
            })
            .catch((error) => {
                console.log(error)
                alert(error)
                alert("User Not Created")
                dispatch(setIsLoadingTree(false));
            })
            setOpenAddUser(false);
        }
        else{
            Swal.fire({
                title: "Display Name and Login Name are mandatory",
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
    }
  
    return (
        <BootstrapDialog
        onClose={handleCloseAddUser}
        aria-labelledby="customized-dialog-title"
        open={openAddUser}
        PaperProps={{
        style: {
            width:"750px", height:"750px"
        },
        }}
    >
        <StyledBootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseAddUser}>
        Create User
        </StyledBootstrapDialogTitle>
        <DialogContent dividers>
        <div style={{padding:"0px 56px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center" ,margin:"12px"}}>
            <Typography >Display Name</Typography>
            <TextField autoComplete='off' required id="addDisplayName" placeholder='Enter the Display Name' value={userName} onChange={(e)=>setUserName(e.target.value)} />
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center" ,margin:"12px"}}>
            <Typography >Login Name</Typography>
            <TextField autoComplete='off' required id="addLoginName" placeholder='Enter the Login Name' value={userLoginName} onChange={(e)=>setUserLoginName(e.target.value)} />
            </div>
        </div>
        </DialogContent>
        <DialogActions>
        <ModalStyledButton autoFocus onClick={handleCloseAddUser} type="cancel">
            Cancel
        </ModalStyledButton>
        <ModalStyledButton autoFocus onClick = {handleAddUser} type="confirm">
            Add
        </ModalStyledButton>
        </DialogActions>
        </BootstrapDialog>
    )   
}

export default CreateUserModal