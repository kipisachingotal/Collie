import React, {useState} from 'react';
import { useDispatch,useSelector } from "react-redux";
import { setIsLoadingTree } from "../../redux/mainStore";
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import StyledBootstrapDialogTitle from "../StyledBootstrapDialogTitle";
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

function DropUserModal({openDropUser,handleCloseDropUser,setOpenDropUser,allUsers,getUsers}) {

    const dispatch = useDispatch();
    const [userRemoveName, setUserRemoveName] = useState(null);

    const handleDropUser = () => {
        console.log("tring to remove : ", userRemoveName)
        if (userRemoveName.length > 0) {
        console.log("Dropping the user", userRemoveName.map(u=>u.value))
        dispatch(setIsLoadingTree(true));
            axios({
                method: 'post',
                url: `https://ww6g8cugsl.execute-api.ap-south-1.amazonaws.com/dev/drop_user/`,
                data: { 
                    "userName":JSON.parse(localStorage.getItem('userCreds')).username,
                    "password":JSON.parse(localStorage.getItem('userCreds')).password,
                    "account":JSON.parse(localStorage.getItem('userCreds')).account,
                    "data":[
                        "SECURITYADMIN",
                        userRemoveName.map(u=>u.value)
                    ]
                },
                headers: {
                    // 'Authorization': `bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => {
                console.log("Drop user response :", response);
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
                    dispatch(setIsLoadingTree(true));
                    getUsers().then(()=> {
                        dispatch(setIsLoadingTree(false));
                    });
                }
                else{
                    dispatch(setIsLoadingTree(false));
                }
            })
            .catch((error) => {
                dispatch(setIsLoadingTree(false));
                console.log(error)
            alert("User Drop Not Successful")
            })
            setOpenDropUser(false);
        }
        else{
            Swal.fire({
                title: "Please select a user",
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
        onClose={handleCloseDropUser}
        aria-labelledby="customized-dialog-title"
        open={openDropUser}
        PaperProps={{
            style: {
                width:"750px", height:"750px"
            },
        }}
        >
            <StyledBootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseDropUser}>
                Drop User
            </StyledBootstrapDialogTitle>
            <DialogContent dividers>
                <div style={{padding:"0px 56px"}}>
                    <div style={{alignItems:"center" ,margin:"12px"}}><div>
                        <p>Select user to drop : </p>
                        <Select
                            isMulti
                            defaultValue={userRemoveName}
                            onChange={setUserRemoveName}
                            options={allUsers.map(user => ({value: user.NAME, label: user.NAME}))}
                        />
                    </div>

                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <ModalStyledButton autoFocus onClick={handleCloseDropUser} type="cancel">
                    Cancel
                </ModalStyledButton>
                <ModalStyledButton autoFocus onClick = {handleDropUser} type="confirm">
                    Drop
                </ModalStyledButton>
            </DialogActions>
        </BootstrapDialog>
    )
}

export default DropUserModal