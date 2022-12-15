import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import StyledBootstrapDialogTitle from "../StyledBootstrapDialogTitle";
import Typography from '@mui/material/Typography';
import {ModalStyledButton} from "../ModalStyledButton";
import Select from 'react-select';
import Swal from 'sweetalert2'
import axios from "axios"
import data from "../../config/data";
import AccountImage from '../../assets/account.png';
import DatabaseImage from '../../assets/database.png';
import SchemaObjectImage from '../../assets/schema.png';
import GlobalImage from '../../assets/global.png';
import {setIsLoadingTree} from "../../redux/mainStore";
import {useDispatch} from "react-redux";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

function RevokePrivsModal({openRevokePrivs,handleCloseRevokePrivs,setOpenRevokePrivs,allNodes}) {
    const dispatch = useDispatch();
    
    const [role, setRole] = useState(null);
    const [privilegeObjectLevel,setPrivilegeObjectLevel] = useState(null)
    const [privilegeObjectName,setPrivilegeObjectName] = useState(null)
    const [privilegesObjectNameOwnershipName,setPrivilegesObjectNameOwnershipName] = useState(null)
    const [privilegesObjectNameInDBObjectValueOptions,setPrivilegesObjectNameInDBObjectValueOptions] = useState([])
    const [privilegesObjectInDBValue,setPrivilegesInDBObjectValue] = useState(null)
    const [privilegesObjectNameInDBSchemaObjectValueOptions,setPrivilegesObjectNameInDBSchemaObjectValueOptions] = useState([])
    const [privilegesObjectInDBSchemaValue,setPrivilegesInDBSchemaObjectValue] = useState(null)
    const [privilegesObjectValue,setPrivilegesObjectValue] = useState([])
    const [privilegesObjectValueOptions,setPrivilegesObjectValueOptions] = useState([])
    const [privileges,setPrivileges] = useState([])

    useEffect(()=>{
      if(privilegeObjectLevel!=null){
        setPrivilegeObjectName(null);
        setPrivilegesObjectNameOwnershipName(null);
        setPrivileges([]);
        setPrivilegesObjectValueOptions([]);
        setPrivilegesObjectValue(null);
        setPrivilegesObjectNameInDBObjectValueOptions([]);
        setPrivilegesInDBObjectValue(null);
        setPrivilegesInDBSchemaObjectValue(null);
      }
    },[privilegeObjectLevel])

    useEffect(()=>{
      if(privilegeObjectName!=null){
        setPrivileges([]);
        setPrivilegesObjectValueOptions([]);
        setPrivilegesObjectValue(null);
        setPrivilegesObjectNameOwnershipName(null);
        setPrivilegesObjectNameInDBObjectValueOptions([]);
        setPrivilegesInDBObjectValue(null);
        setPrivilegesInDBSchemaObjectValue(null);
        getPrivilegeObjectValues();
      }
    },[privilegeObjectName])

    useEffect(()=>{
      setPrivileges([]);
      setPrivilegesObjectNameInDBObjectValueOptions([]);
      setPrivilegesInDBObjectValue(null);
      setPrivilegesObjectNameInDBSchemaObjectValueOptions([]);
      setPrivilegesInDBSchemaObjectValue(null);
      if(privilegeObjectLevel != null && 
        privilegeObjectName != null && 
        privilegesObjectNameOwnershipName !== null){
        
        if ((['ALL SCHEMAS','FUTURE SCHEMAS','ALL TABLES'].includes(privilegeObjectName.value) === false ||
          (privilegeObjectName.value === 'ALL TABLES' && privilegeObjectLevel === 'SchemaObject')) &&
          data.privileges.find(p => p.ObjectLevel === privilegeObjectLevel && 
          p.ObjectName === privilegeObjectName.value && 
          p.EXEC_ROLE.includes(privilegesObjectNameOwnershipName.value)).InObject.includes('DATABASE')
          ) {
            getPrivilegeObjectInDBValueOptions();
        }
      }
    },[privilegesObjectNameOwnershipName])


    useEffect(() => {
      setPrivilegesObjectValueOptions([]);
      setPrivilegesObjectNameInDBSchemaObjectValueOptions([]);
      setPrivilegesObjectValue(null);
      setPrivilegesInDBSchemaObjectValue(null);
      setPrivileges([]);
      if (privilegesObjectInDBValue != null) {
        getDBSchemas(privilegesObjectInDBValue.value);
      }

    },[privilegesObjectInDBValue])

    useEffect(() => {
      setPrivilegesObjectValueOptions([]);
      setPrivileges([]);
      if (privilegesObjectInDBSchemaValue != null) {
        getDBSchemasObjects(privilegesObjectInDBValue.value, privilegesObjectInDBSchemaValue.value,privilegeObjectName.value);
      }

    },[privilegesObjectInDBSchemaValue])
  
    const getPrivilegeObjectStyle = (objectLevel) =>{
      if(objectLevel==privilegeObjectLevel)
        return "lightgrey"
      else
        return "transparent"
    }
  
    const getPrivilegeObjectStyleImageSource = (objectLevel) =>{
      if(objectLevel=="Global")
        return GlobalImage
      else if(objectLevel=="AccountObject")
        return AccountImage
      else if(objectLevel=="DatabaseObject")
        return DatabaseImage
      else if(objectLevel=="SchemaObject")
        return SchemaObjectImage
    }

    const getPrivilegeObjectInDBValueOptions = async () =>{
      try {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:8888/return_databases/',
            data : {
              "userName":JSON.parse(localStorage.getItem('userCreds')).username,
              "password":JSON.parse(localStorage.getItem('userCreds')).password,
              "account":JSON.parse(localStorage.getItem('userCreds')).account
            }
        })
        if (response.data["flag"] == 1) {
          console.log(response.data["response"])
          setPrivilegesObjectNameInDBObjectValueOptions(response.data["response"].map(o=>{
            return({"value":o["NAME"],"label":o["NAME"]})
          }))  
        }
        else {
          console.log(response.data)
          alert("Request failed for api request ")  
        }
        // dispatch(setIsLoadingTree(false));

      }
    catch (error) {
        console.log(error)
        alert("error in api request")
      // dispatch(setIsLoadingTree(false));

    }
    }


    const getDBSchemas = async (DB) =>{
      try {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:8888/return_schemas/',
            data : {
              "userName":JSON.parse(localStorage.getItem('userCreds')).username,
              "password":JSON.parse(localStorage.getItem('userCreds')).password,
              "account":JSON.parse(localStorage.getItem('userCreds')).account,
              "data":[DB]
            }
        })
        if (response.data["flag"] == 1) {
          console.log(response.data["response"])

          if (data.privileges.find(p => p.ObjectLevel === privilegeObjectLevel && 
            p.ObjectName === privilegeObjectName.value && 
            p.EXEC_ROLE.includes(privilegesObjectNameOwnershipName.value)).InObject.includes('SCHEMA') &&
            ['ALL TABLES','FUTURE TABLES'].includes(privilegeObjectName.value) === false
            ){
              setPrivilegesObjectNameInDBSchemaObjectValueOptions(response.data["response"].map(o=>{
                return({"value":o["NAME"],"label":o["NAME"]})
              }))
            }
            else{
              setPrivilegesObjectValueOptions(response.data["response"].map(o=>{
                return({"value":o["NAME"],"label":o["NAME"]})
              })) 
            }
           
        }
        else {
          console.log(response.data)
          alert("Request failed for api request ")  
        }
        // dispatch(setIsLoadingTree(false));

      }
    catch (error) {
        console.log(error)
        alert("error in api request")
      // dispatch(setIsLoadingTree(false));

    }
    }


    const getDBSchemasObjects = async (DB,SCHEMA,TYPE) =>{
      try {

        let OBJ_TYPE = TYPE;

        if (OBJ_TYPE === "EXTERNAL STAGE" || OBJ_TYPE === "INTERNAL STAGE"){
          OBJ_TYPE = "STAGE"
        }
        
        const response = await axios({
            method: 'post',
            url: 'http://localhost:8888/return_schema_object_lists/',
            data : {
              "userName":JSON.parse(localStorage.getItem('userCreds')).username,
              "password":JSON.parse(localStorage.getItem('userCreds')).password,
              "account":JSON.parse(localStorage.getItem('userCreds')).account,
              "data":[DB,SCHEMA,OBJ_TYPE+"S"]
            }
        })
        if (response.data["flag"] == 1) {
          console.log(response.data["response"])

          let data = response.data["response"];

          if (TYPE === "EXTERNAL STAGE"){
             data = data.filter(e => e.type === 'EXTERNAL');
          }
          else if (TYPE === "INTERNAL STAGE"){
            data = data.filter(e => e.type === 'INTERNAL');
          }

          setPrivilegesObjectValueOptions(data.map(o=>{
            return({"value":o["name"],"label":o["name"]})
          })) 
           
        }
        else {
          console.log(response.data)
          alert("Request failed for api request ")  
        }
        // dispatch(setIsLoadingTree(false));

      }
    catch (error) {
        console.log(error)
        alert("error in api request")
      // dispatch(setIsLoadingTree(false));

    }
    }

  
    const getPrivilegeObjectValues = async () =>{
      // dispatch(setIsLoadingTree(true));

      let api = '';
      switch(privilegeObjectName.value) {
        case 'ACCOUNT':
          setPrivilegesObjectValueOptions([
                  {"value":'GVA67944',"label":'GVA67944'}
                ])
          return ; 
        case 'USER':
          api = 'return_users'
          break;
        case 'WAREHOUSE':
          api = 'return_warehouse'
          break;
        case 'DATABASE':
          api = 'return_databases'
          break;
        case 'RESOURCE MONITOR':
          api = 'return_resource_monitors'
          break;
        case 'INTEGRATION':
          api = 'return_integrations'
          break; 
        case 'ALL SCHEMAS':          
          if (privilegeObjectLevel === 'DatabaseObject') {
            api = 'return_databases'
            break;
          }
          else {
            api = ''
            setPrivilegesObjectValueOptions([]);
            return;
          }
        case 'FUTURE SCHEMAS':
          if (privilegeObjectLevel === 'DatabaseObject') {
            api = 'return_databases'
            break;
          }
          else {
            api = ''
            setPrivilegesObjectValueOptions([]);
            return;
          }
        case 'ALL TABLES':
          if (privilegeObjectLevel === 'DatabaseObject') {
            api = 'return_databases'
            break;
          }
          else {
            api = ''
            setPrivilegesObjectValueOptions([]);
            return;
          }

        default:
          api = ''
          setPrivilegesObjectValueOptions([]);
          return;
      }

      try {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:8888/'+api+'/',
            data : {
              "userName":JSON.parse(localStorage.getItem('userCreds')).username,
              "password":JSON.parse(localStorage.getItem('userCreds')).password,
              "account":JSON.parse(localStorage.getItem('userCreds')).account
            }
        })
        if (response.data["flag"] == 1) {
          console.log(response.data["response"])
          setPrivilegesObjectValueOptions(response.data["response"].map(o=>{
            return({"value":o["NAME"],"label":o["NAME"]})
          }))  
        }
        else {
          console.log(response.data)
          alert("Request failed for api request ")  
        }
        // dispatch(setIsLoadingTree(false));

      }
    catch (error) {
        console.log(error)
        alert("error in return_databases")
      // dispatch(setIsLoadingTree(false));

    }
    }
  
    const showPrivilegeObjectLevels = data.privileges.map(d=>d.ObjectLevel).filter((item, i, ar) => ar.indexOf(item) === i).map(objectLevel=>{
      return(
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", border:`4px solid ${getPrivilegeObjectStyle(objectLevel)}`}}>
          <Button onClick={()=>{setPrivilegeObjectLevel(objectLevel)}}>
            <img style={{height:"80px", width:"80px", backgroundColor:"white"}} src={getPrivilegeObjectStyleImageSource(objectLevel)} alt={objectLevel} />
          </Button>
          <p>{objectLevel}</p>
        </div>
      )
    })

    const handleRevokePrivsToRole=() =>{
      console.log("trying to revoke privs to : ", role)
      if (role==null){
        alert("Please select a Role")
      }
      else if (privilegeObjectName==null){
        alert("Please select a Privilege Object")
      }
      else if (privilegesObjectNameOwnershipName == null) {
        alert("Please select Ownership Role")
      }
      else if (privilegesObjectValue.length==0){
        alert(`Please select ${privilegeObjectName}(S)`)
      }
      else if (privileges.length==0){
        alert("Please select some Privileges")
      }
      else {

        var data = []
        console.log(privilegeObjectLevel);
        switch(privilegeObjectLevel) {
          case "Global": 
            if(privilegeObjectName.value === 'ACCOUNT'){
              data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,[""],"","",role.map(r=>r.value)]
            }
            break;
          case "AccountObject":
            if(privilegeObjectName.value === 'USER'){
              data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=>p.value),"","",role.map(r=>r.value)]
            }
            else if(privilegeObjectName.value === 'DATABASE'){
              data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=>p.value),"","",role.map(r=>r.value)]
            }
            else if(privilegeObjectName.value === 'WAREHOUSE'){
              data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=>p.value),"","",role.map(r=>r.value)]
            }
            else if(privilegeObjectName.value === 'RESOURCE MONITOR'){
              data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=>p.value),"","",role.map(r=>r.value)]
            }
            else if(privilegeObjectName.value === 'INTEGRATION'){
              data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=>p.value),"","",role.map(r=>r.value)]
            }
            break;
          case "DatabaseObject":
            if(privilegeObjectName.value === 'SCHEMA'){
              data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=>privilegesObjectInDBValue.value + "." + p.value),"","",role.map(r=>r.value)]
            }
            else if (privilegeObjectName.value === 'ALL SCHEMAS') {
              data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,[""],"DATABASE",privilegesObjectValue.value,role.map(r=>r.value)]
            }
            else if (privilegeObjectName.value === 'FUTURE SCHEMAS') {
              data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,[""],"DATABASE",privilegesObjectValue.value,role.map(r=>r.value)]
            }
            else if (privilegeObjectName.value === 'ALL TABLES') {
              data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,[""],"DATABASE",privilegesObjectValue.value,role.map(r=>r.value)]
            }
            break;
          case "SchemaObject":
            let schema_namespace = null;
            if (['ALL TABLES','FUTURE TABLES'].includes(privilegeObjectName.value)){
              schema_namespace = privilegesObjectInDBValue.value + "." + privilegesObjectValue.value; 
            }
            else {
              schema_namespace = privilegesObjectInDBValue.value + "." + privilegesObjectInDBSchemaValue.value; 
            }
            
              if(privilegeObjectName.value === 'TABLE'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'VIEW'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'MATERIALIZED VIEW'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'STREAM'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'SEQUENCE'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'FUNCTION'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),"FUNCTION",privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'EXTERNAL FUNCTION'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),"FUNCTION",privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'PROCEDURE'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'FILE FORMAT'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'EXTERNAL STAGE'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),"STAGE",privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'INTERNAL STAGE'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),"STAGE",privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'PIPE'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'TASK'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'MASKING POLICY'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'ROW ACCESS POLICY'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'SESSION POLICY'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              if(privilegeObjectName.value === 'TAG'){
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,privilegesObjectValue.map(p=> schema_namespace + "." + p.value),"","",role.map(r=>r.value)]
              }
              else if (privilegeObjectName.value === 'ALL TABLES') {
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,[""],"SCHEMA",schema_namespace,role.map(r=>r.value)]
              }
              else if (privilegeObjectName.value === 'FUTURE TABLES') { 
                data = [privilegesObjectNameOwnershipName.value,privileges.map(p=>p.value).join(","),privilegeObjectName.value,[""],"SCHEMA",schema_namespace,role.map(r=>r.value)]
              }
              
              break;
          default: return;
        }
        console.log("data is :",data)
        dispatch(setIsLoadingTree(true));
        axios({
          method: 'post',
          url: `http://localhost:8888/revoke_privs_from_role/`,
          data: {
            "userName":JSON.parse(localStorage.getItem('userCreds')).username,
            "password":JSON.parse(localStorage.getItem('userCreds')).password,
            "account":JSON.parse(localStorage.getItem('userCreds')).account,
            "data":data
          },
          headers: {
            // 'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })
        .then((response) => {
          console.log("Revoke privs response :", response);
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
          // alert(error)
          dispatch(setIsLoadingTree(false));
          alert("Couldn't revoke Privileges")
        })
        setOpenRevokePrivs(false);
      }
    }

    return (
        <BootstrapDialog
            onClose={handleCloseRevokePrivs}
            aria-labelledby="customized-dialog-title"
            open={openRevokePrivs}
            PaperProps={{
                style: {
                width:"750px", height:"750px"
                },
            }}
        >
            <StyledBootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseRevokePrivs}>
                Revoke Privileges
            </StyledBootstrapDialogTitle>
            <DialogContent dividers>
              <p>Select a Role to Revoke Privileges</p>
              <Select
                  isMulti
                  placeholder="Select a Role"
                  onChange={setRole}
                  options={allNodes}
              />
              <p>Select Privilege Object Level</p>
              <div style={{display: "flex", alignItems: "center", flexDirection: "row", flexWrap: "wrap"}}>
                {showPrivilegeObjectLevels}
              </div>
              <div style={{display: "flex", alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: "2px"}}>
                
              { privilegeObjectLevel != null &&
                  <Select
                    placeholder="Select an Object" 
                    value={privilegeObjectName}
                    onChange={setPrivilegeObjectName}
                    options={data.privileges.filter(p=>p.ObjectLevel===privilegeObjectLevel).map(p => p.ObjectName).filter((value, index, self) => self.indexOf(value) === index).map(p => ({value: p, label: p}))}
                  />
                }
                { privilegeObjectLevel != null && privilegeObjectName != null && 
                  <Select
                    placeholder={`Select Ownership Role`}
                    value={privilegesObjectNameOwnershipName}
                    onChange={setPrivilegesObjectNameOwnershipName}
                    options={data.privileges.filter(p=>p.ObjectLevel==privilegeObjectLevel && p.ObjectName==privilegeObjectName.value).map(p => p.EXEC_ROLE).join().split(',').filter((value, index, self) => self.indexOf(value) === index).map(p => ({value: p, label: p}))}
                  />
                }
                { privilegeObjectLevel != null && privilegeObjectName != null && privilegesObjectNameOwnershipName != null && privilegesObjectNameInDBObjectValueOptions.length !== 0 &&
                  <Select
                    placeholder={`Select Database`}
                    value={privilegesObjectInDBValue}
                    onChange={setPrivilegesInDBObjectValue}
                    options={privilegesObjectNameInDBObjectValueOptions}
                  />
                }
                { privilegeObjectLevel != null && privilegeObjectLevel === 'SchemaObject' && privilegeObjectName != null 
                && privilegesObjectNameOwnershipName != null && privilegesObjectInDBValue && 
                privilegesObjectNameInDBSchemaObjectValueOptions.length !== 0 &&
                  <Select
                    placeholder={`Select Schemas`}
                    value={privilegesObjectInDBSchemaValue}
                    onChange={setPrivilegesInDBSchemaObjectValue}
                    options={privilegesObjectNameInDBSchemaObjectValueOptions}
                  />
                }
                { privilegeObjectLevel != null && privilegeObjectName != null && privilegesObjectNameOwnershipName != null && privilegesObjectValueOptions.length !== 0 &&
                  <Select
                    isMulti={['ACCOUNT','ALL SCHEMAS','FUTURE SCHEMAS','ALL TABLES', 'FUTURE TABLES'].includes(privilegeObjectName.value) ? false : true}
                    placeholder={
                      ['ALL SCHEMAS','FUTURE SCHEMAS','ALL TABLES'].includes(privilegeObjectName.value) && privilegeObjectLevel === 'DatabaseObject'
                      ? `Select DATABASE` 
                      : (
                        ['FUTURE TABLES','ALL TABLES'].includes(privilegeObjectName.value) && privilegeObjectLevel === 'SchemaObject' 
                        ? `Select SCHEMA` 
                        :
                        `Select ${privilegeObjectName.value}(S)`
                      ) 
                    }
                    value={privilegesObjectValue}
                    onChange={setPrivilegesObjectValue}
                    options={privilegesObjectValueOptions}
                  />
                }
                { privilegeObjectLevel != null && privilegeObjectName != null && privilegesObjectNameOwnershipName !== null && privilegesObjectValue != null &&
                  <Select
                    isMulti
                    placeholder="Select Privileges"
                    value={privileges}
                    onChange={setPrivileges}
                    options={data.privileges.filter(p=>(p.ObjectLevel=== privilegeObjectLevel && p.ObjectName === privilegeObjectName.value && p.EXEC_ROLE.includes(privilegesObjectNameOwnershipName.value))).map(p => p.PRIVS_LIST).join().split(',').filter((value, index, self) => self.indexOf(value) === index).map(p => ({value: p, label: p}))}
                    
                  />
                }
              </div>
            </DialogContent>
            <DialogActions>
                <ModalStyledButton autoFocus onClick={handleCloseRevokePrivs} type="cancel">
                Cancel
                </ModalStyledButton>
                <ModalStyledButton autoFocus onClick = {handleRevokePrivsToRole} type="confirm">
                Revoke
                </ModalStyledButton>
            </DialogActions>
        </BootstrapDialog>
    )
}

export default RevokePrivsModal