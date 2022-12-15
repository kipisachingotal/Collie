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

function DropWarehouseModal({openDropWarehouse,setOpenDropWarehouse,getWarehouses,handleCloseDropWarehouse,warehouses}) {

    const dispatch = useDispatch();
    const [warehouseRemoveName, setWarehouseRemoveName] = useState(null);

    const handleDropWarehouse = () => {
        console.log("trying to remove : ", warehouseRemoveName)
        if (warehouseRemoveName.length > 0) {
          dispatch(setIsLoadingTree(true));
          console.log("Dropping the warehouses : ",warehouseRemoveName.map(w=>w.value))
          axios({
            method: 'post',
            url: `http://localhost:8888/drop_warehouse/`,
            data: { 
              "userName":JSON.parse(localStorage.getItem('userCreds')).username,
              "password":JSON.parse(localStorage.getItem('userCreds')).password,
              "account":JSON.parse(localStorage.getItem('userCreds')).account,
              "data":[
                "SYSADMIN",
                warehouseRemoveName.map(w=>w.value)
              ]
            },
            headers: {
              // 'Authorization': `bearer ${token}`,
              'Content-Type': 'application/json'
            },
          })
          .then((response) => {
            console.log("Drop warehouse response :", response);
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
              getWarehouses().then(()=> {
                dispatch(setIsLoadingTree(false));
              });
            }
            dispatch(setIsLoadingTree(false));

          })
          .catch((error) => {
            dispatch(setIsLoadingTree(false));
            console.log(error)
            alert("Could not drop warehouse")
          })
          setOpenDropWarehouse(false);
        }
        else{
          Swal.fire({
            title: "Please select a warehouse",
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
        onClose={handleCloseDropWarehouse}
        aria-labelledby="customized-dialog-title"
        open={openDropWarehouse}
        PaperProps={{
        style: {
          width:"750px", height:"750px"
        },
        }}
    >
        <StyledBootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseDropWarehouse}>
        Drop Warehouse
        </StyledBootstrapDialogTitle>
        <DialogContent dividers>
        <div style={{padding:"0px 56px"}}>
          <div style={{alignItems:"center" ,margin:"12px"}}>
            <div>
              <p>Select warehouse to drop : </p>
              <Select
                  isMulti
                  defaultValue={warehouseRemoveName}
                  onChange={setWarehouseRemoveName}
                  options={warehouses.filter(w=>w.NAME!="COMPUTE_WH").map(warehouse => ({value: warehouse.NAME, label: warehouse.NAME}))}
              />
            </div>
          </div>
        </div>
        </DialogContent>
        <DialogActions>
        <ModalStyledButton autoFocus onClick={handleCloseDropWarehouse} type="cancel">
            Cancel
        </ModalStyledButton>
        <ModalStyledButton autoFocus onClick = {handleDropWarehouse} type="confirm">
            Drop
        </ModalStyledButton>
        </DialogActions>
        </BootstrapDialog>
    )
}

export default DropWarehouseModal