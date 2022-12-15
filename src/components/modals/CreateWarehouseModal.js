import React, {useState} from 'react';
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
import Select from 'react-select';
import Swal from 'sweetalert2'
import axios from "axios"
import data from "../../config/data";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
    'MuiDialog-paper' :{

    }
}));

function CreateWarehouseModal({openAddWarehouse,setOpenAddWarehouse,handleCloseAddWarehouse,getWarehouses}) {

    const dispatch = useDispatch();  
    const [warehouseName,  setWarehouseName] = useState(null);
    const [warehouseSize,  setWarehouseSize] = useState(null);
    const [maxClusters,  setmaxClusters] = useState(null);
    const [minClusters,  setminClusters] = useState(null);
    const [scalingPolicy,  setScalingPolicy] = useState(null);
    const [autoSuspend,  setAutoSuspend] = useState(null);
    const [autoResume,  setAutoResume] = useState(null);
    const [initiallySuspended,  setInitiallySuspended] = useState(null);

    const handleAddWarehouse = () => {
        if(warehouseName==null || warehouseName.length==0){
            alert("Warehouse Name is required")
        }
        else if(warehouseSize==null){
            alert("Warehouse Size is required")
        }
        else if(maxClusters==null){
            alert("Maximum Clusters is required")
        }
        else if(minClusters==null){
            alert("Minimum Clusters is required")
        }
        else if(scalingPolicy==null){
            alert("Scaling Policy is required")
        }
        else if(autoSuspend==null){
            alert("Auto Suspend is required")
        }
        else if(autoResume==null){
            alert("Auto Resume is required")
        }
        else if(initiallySuspended==null){
            alert("Initially Suspended is required")
        }
        else {
          dispatch(setIsLoadingTree(true));
          console.log("Adding the warehouse")
          axios({
            method: 'post',
            url: `https://ww6g8cugsl.execute-api.ap-south-1.amazonaws.com/dev/create_warehouse/`,
            data: { 
              "userName":JSON.parse(localStorage.getItem('userCreds')).username,
              "password":JSON.parse(localStorage.getItem('userCreds')).password,
              "account":JSON.parse(localStorage.getItem('userCreds')).account,
              "data":[
                "SYSADMIN",
                warehouseName,
                warehouseSize.value,
                maxClusters.value,
                minClusters.value,
                scalingPolicy.value,
                autoSuspend.value,
                autoResume.value,
                initiallySuspended.value,
                ]
              }
            ,
            headers: {
              // 'Authorization': `bearer ${token}`,
              'Content-Type': 'application/json'
            },
          })
            .then((response) => {
              console.log("Create warehouse response :", response);
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
              else {
                dispatch(setIsLoadingTree(false));
              }
            })
            .catch((error) => {
              console.log(error)
              // alert(error)
              alert("Could not create warehouse")
              dispatch(setIsLoadingTree(false));

            })
          setOpenAddWarehouse(false);
        }
      }

  return (
    <BootstrapDialog
    onClose={handleCloseAddWarehouse}
    aria-labelledby="customized-dialog-title"
    open={openAddWarehouse}
    PaperProps={{
        style: {
          width:"750px", height:"750px"
        },
    }}
    >
        <StyledBootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseAddWarehouse}>
            Create Warehouse
        </StyledBootstrapDialogTitle>
        <DialogContent dividers>
        <div style={{padding:"0px 36px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center" ,margin:"12px"}}>
            <Typography >Name</Typography>
            <TextField autoComplete='off' sx={{width: "240px"}} required id="addRoleName" placeholder='Enter the Warehouse Name' value={warehouseName} onChange={(e)=>setWarehouseName(e.target.value)} />
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"12px"}}>
            <Typography >Size</Typography>
            <div style={{width: "240px"}}><Select
                defaultValue={warehouseSize}
                onChange={setWarehouseSize}
                options={[{value: "XSmall", label: "X-Small"}, {value: "Small", label: "Small"}, {value: "Medium", label: "Medium"}, {value: "Large", label: "Large"}, {value: "XLarge", label: "X-Large"}, {value: "2XLarge", label: "2X-Large"}, {value: "3XLarge", label: "3X-Large"}, {value: "4XLarge", label: "4X-Large"}, {value: "5XLarge", label: "5X-Large"} ]}
            /></div>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"12px"}}>
            <Typography >Maximum Clusters</Typography>
            <div style={{width: "240px"}}><Select
                defaultValue={maxClusters}
                onChange={setmaxClusters}
                options={[{value: 1, label: 1},{value: 2, label: 2},{value: 3, label: 3},{value: 4, label: 4},{value: 5, label: 5},{value: 6, label: 6},{value: 7, label: 7},{value: 8, label: 8},{value: 9, label: 9},{value: 10, label: 10}]}
            /></div>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"12px"}}>
            <Typography >Minimum Clusters</Typography>
            <div style={{width: "240px"}}><Select
                defaultValue={minClusters}
                onChange={setminClusters}
                options={[{value: 1, label: 1},{value: 2, label: 2}]}
            /></div>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"12px"}}>
            <Typography >Scaling Policy</Typography>
            <div style={{width: "240px"}}><Select
                defaultValue={scalingPolicy}
                onChange={setScalingPolicy}
                options={[{value: "STANDARD", label: "STANDARD"},{value: "ECONOMY", label: "ECONOMY"}]}
            /></div>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"12px"}}>
            <Typography >Auto Suspend</Typography>
            <div style={{width: "240px"}}><Select
                defaultValue={autoSuspend}
                onChange={setAutoSuspend}
                options={[{value: 300, label: "5 minutes"},{value: 600, label: "10 minutes"},{value: 900, label: "15 minutes"},{value: 1800, label: "30 minutes"},{value: 2700, label: "45 minutes"},{value: 3600, label: "1 hour"},{value: 5400, label: "1 hour 30 minutes"},{value: 7200, label: "2 hour"},{value: 10800, label: "3 hour"},{value: 0, label: "Never"}]}
            /></div>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"12px"}}>
            <Typography >Auto Resume</Typography>
            <div style={{width: "240px"}}><Select
                defaultValue={autoResume}
                onChange={setAutoResume}
                options={[{value: "TRUE", label: "TRUE"},{value: "FALSE", label: "FALSE"}]}
            /></div>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"12px"}}>
            <Typography >Initialy Suspended</Typography>
            <div style={{width: "240px"}}><Select
                defaultValue={initiallySuspended}
                onChange={setInitiallySuspended}
                options={[{value: "TRUE", label: "TRUE"},{value: "FALSE", label: "FALSE"}]}
            /></div>
            </div>
        </div>
        </DialogContent>
        <DialogActions>
            <ModalStyledButton autoFocus onClick={handleCloseAddWarehouse} type="cancel">
                Cancel
            </ModalStyledButton>
            <ModalStyledButton autoFocus onClick = {handleAddWarehouse} type="confirm">
                Add
            </ModalStyledButton>
        </DialogActions>
    </BootstrapDialog>
  )
}

export default CreateWarehouseModal