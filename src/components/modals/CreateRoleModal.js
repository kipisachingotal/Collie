import React,{useEffect, useState} from 'react';
import { useDispatch,useSelector } from "react-redux";
import { setIsLoadingTree } from "../../redux/mainStore";
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import StyledBootstrapDialogTitle from "../StyledBootstrapDialogTitle";
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import {ModalStyledButton} from "../ModalStyledButton";
import HelpIcon from '@mui/icons-material/Help';
import Tooltip,{ tooltipClasses } from '@mui/material/Tooltip';
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
}));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 240,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

function CreateRoleModal({handleCloseAddRole,openAddRole,setOpenAddRole,getDisconnectedNodes,getNodes,getAllNodes}) {

    const dispatch = useDispatch();
    const [environmentOptions,setEnvironmentOptions] = useState([]);
    const [roleCategoryOptions,setRoleCategoryOptions] = useState([]);
    const [roleTypeOptions,setRoleTypeOptions] = useState([]);
    const [tagValues,setTagValues] = useState(null);
    const [environment,setEnvironment] = useState("");
    const [roleCategory,setRoleCategory] = useState("");
    const [roleType,setRoleType] = useState("");
    const [roleName,setRoleName] = useState("");
    const [roleComments,setRoleComments] = useState("");

    const getTagValues = async () => {
      try {
          const response = await axios({
              method: 'post',
              url: `http://localhost:8888/return_tag_values/`,
              data : {
                "userName":JSON.parse(localStorage.getItem('userCreds')).username,
                "password":JSON.parse(localStorage.getItem('userCreds')).password,
                "account":JSON.parse(localStorage.getItem('userCreds')).account
              }
          })
          if (response.data["flag"] == 1) {
            console.log(response.data["response"])
            var _tagValues = {}
            for(var x of response.data["response"]){
              _tagValues[x.tag]=x.tagValues.substring(1,x.tagValues.length - 1).replace(/"/g, '').split(",")
            }
            console.log("setting tagValues to : ",_tagValues)
            console.log("enviroment tagValues are : ",_tagValues["ENVIRONMENT"]) 
            setTagValues(_tagValues)  
          }
          else {
            console.log(response.data)
            alert("Request failed for return_tag_values")  
          }
      }
      catch (error) {
          console.log(error)
          alert("error in return_tag_values")
      }
    }

    useEffect(()=>{
      getTagValues();
    },[])

    useEffect(()=>{
      if(tagValues){
        setEnvironmentOptions(tagValues["ENVIRONMENT"].filter(v=>v!="system").map(v=>{
          return({
              "value":v.toUpperCase(),
              "label":v.toUpperCase()
          })
        }))
        setRoleCategoryOptions(tagValues["ROLE_CATEGORY"].map(v=>{
          return({
              "value":v.toUpperCase(),
              "label":v.toUpperCase()
          })
        }))
        setRoleTypeOptions(tagValues["ROLE_TYPE"].map(v=>{
          return({
              "value":v.toUpperCase(),
              "label":v.toUpperCase()
          })
        })) 
      }
    },[tagValues])

    const handleAddRole = () =>{
      if(environment.length<1){
        Swal.fire({
          title: "Please select an environment",
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
      else if(roleName.length>0){
        dispatch(setIsLoadingTree(true));
        console.log("Adding the role")
        console.log(roleName)
        console.log(roleComments)
        var payload = {
          "userName":JSON.parse(localStorage.getItem('userCreds')).username,
          "password":JSON.parse(localStorage.getItem('userCreds')).password,
          "account":JSON.parse(localStorage.getItem('userCreds')).account,
          "data":["SECURITYADMIN", roleName, roleComments,environment]
        }
        axios({
          method: 'post',
          url: `http://localhost:8888/create_role/`,
          data: payload,
          headers: {
            // 'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
          },
        })
        .then((response) => {
          console.log("Create role response :", response);
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
          }
          else {
            dispatch(setIsLoadingTree(false));
          }
          setOpenAddRole(false);
        })
        .catch((error) => {
          console.log(error)
          dispatch(setIsLoadingTree(false));
          alert(error)
        })
      }
        else{
          Swal.fire({
            title: "Please enter a Role Name",
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
    onClose={handleCloseAddRole}
    aria-labelledby="customized-dialog-title"
    open={openAddRole}
    PaperProps={{
      style: {
        width:"750px", height:"750px"
        },
    }}>
        <StyledBootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseAddRole} sx={{backgroundColor: "#072227",}}>
        Create Role
        </StyledBootstrapDialogTitle>
        <DialogContent dividers>
            <div style={{padding:"0px 36px"}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center" ,margin:"12px"}}>
                    <Typography >Environment</Typography>
                    <div style={{width: "210px"}}>
                        <Select
                        placeholder="Select Environment"
                        onChange={(option)=>{
                            console.log(option);
                              setEnvironment(option.value)
                        }}
                        options={environmentOptions}
                    />
                    </div>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center" ,margin:"12px"}}>
                    <Typography >Role Category</Typography>
                    {/*<div>*/}
                        <div style={{width: "210px"}}>
                        <Select
                        placeholder="Select Role Category"
                        onChange={(option)=>{
                            console.log(option);
                            setRoleCategory(option.value)
                        }}
                        options={roleCategoryOptions}  
                    />
                    </div>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center" ,margin:"12px"}}>
                    <Typography >Role Type</Typography>
                    <div style={{width: "210px"}}><Select
                        placeholder="Select Role Type"
                        onChange={(option)=>{
                            console.log(option);
                            setRoleType(option.value)
                        }}
                        options={roleTypeOptions}
                    /></div>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center" ,margin:"12px"}}>
                    <Typography >Name</Typography>
                    <TextField style={{width:"210px"}} autoComplete='off' required id="addRoleName" placeholder='Enter the Role Name' value={roleName} onChange={(e)=>setRoleName(e.target.value)} />
                </div>
                <div style={{display:"flex", justifyContent:"left", alignItems:"center" ,margin:"12px"}}>
                  <FormControlLabel control={
                    <Checkbox
                      onChange={e=>{
                          console.log(e.target.checked)
                          if(e.target.checked){
                              setRoleName(`${environment}_${roleCategory}_${roleType}_${roleName}`)
                          }
                          else{
                              setRoleName(roleName.split("_")[3]);
                          }
                      }} 
                    />
                  } label="Use Naming Convention" />
                  <HtmlTooltip title="Create role name in the format: <ENVIRONMENT>_<ROLE_CATEGORY>_<ROLE_TYPE>_<NAME>" placement="top-start">
                    <HelpIcon color="disabled" />
                  </HtmlTooltip>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"12px"}}>
                    <Typography >Comments</Typography>
                    <TextField style={{width:"210px"}} autoComplete='off' id="addRoleComments" placeholder='Enter the Comment' value={roleComments} onChange={(e)=>setRoleComments(e.target.value)} />
                </div>
            </div>
        </DialogContent>
        <DialogActions sx={{backgroundColor: "white",}}>
        <ModalStyledButton autoFocus onClick={handleCloseAddRole} type="cancel">
            Cancel
        </ModalStyledButton>
        <ModalStyledButton autoFocus onClick={handleAddRole} type="confirm">
            Add
        </ModalStyledButton>
        </DialogActions>
    </BootstrapDialog>
  )
}

export default CreateRoleModal