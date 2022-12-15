import React, {useEffect, createRef, useState } from 'react';
import { useScreenshot } from 'use-react-screenshot'
import GraphSideBar from '../components/GraphSideBar';
import GraphView from '../components/GraphView';
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import AccountCircle from '@mui/icons-material/AccountCircle';
import {Button, Toolbar} from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import {styled} from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import { setNodes,setEdges, setIsLoadingTree, setIsLoadingTreeOnly } from "../redux/mainStore";
import axios from "axios";
import { ClipLoader } from 'react-spinners';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const GraphPage = () => {

  const { nodes,edges, isLoadingTree, isLoadingTreeOnly } = useSelector(state=>state.mainSlice);
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(true);
    const [disconnectedEdges, setDisconnectedEdges] = React.useState([])
    const [disconnectedNodes, setDisconnectedNodes] = React.useState([])
    const [allUsers, setAllUsers] = React.useState([])
    // const [isLoadingTree, setIsLoadingTree] = React.useState(true);
    console.log(open)
    const [warehouses, setWarehouses] = React.useState([])
    const [allNodes, setAllNodes] = React.useState([])
    const [tabValue, setTabValue] = React.useState('rbac');
    const ref1 = createRef(null)
    const ref2 = createRef(null)
    const [image, takeScreenshot] = useScreenshot()


    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };
    
    const getWarehouses = async () => {
      try{
        const response = await axios({
          method: 'post',
          url: `https://ww6g8cugsl.execute-api.ap-south-1.amazonaws.com/dev/return_warehouse/`,
          data: {
            "userName":JSON.parse(localStorage.getItem('userCreds')).username,
            "password":JSON.parse(localStorage.getItem('userCreds')).password,
            "account":JSON.parse(localStorage.getItem('userCreds')).account
          },
          headers: {
            // 'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })
        if (response.data["flag"] == 1) {
          setWarehouses(response.data["response"])
        }
        else {
          alert("Request failed for return_warehouse")
          console.log(response.data)
        }
      }
      catch(error){
        console.log(error)
        alert("error in return_warehouse")
      }
    }

    const getNodes = async () =>{
      try {
        const response = await axios({
          method: 'post',
          url: `https://ww6g8cugsl.execute-api.ap-south-1.amazonaws.com/dev/rbac_hirerchy/`,
          data: {
            "userName":JSON.parse(localStorage.getItem('userCreds')).username,
            "password":JSON.parse(localStorage.getItem('userCreds')).password,
            "account":JSON.parse(localStorage.getItem('userCreds')).account
          },
          headers: {
            // 'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })
          if (response.data["flag"] == 1) {
            console.log("Nodes from flask :", response.data);
            console.log(response.data["response"])
            const _edges = response.data["response"].map(edge=>{
              return({
                "id":`${edge["PARENT_ROLE"]}_${edge["CHILD_ROLE"]}`,
                "source":edge["PARENT_ROLE"],
                "target":edge["CHILD_ROLE"],
                "label":`${edge["PARENT_ROLE"]}_${edge["CHILD_ROLE"]}`
              })
            })

            dispatch(setEdges(_edges));
            // setEdges(_edges)
            const _nodes = response.data["response"].map((edge) => {
                return {"id": edge["CHILD_ROLE"], "label": edge["CHILD_ROLE"], "level": edge["LEVEL"],"env": edge["ENVIRONMENT"]}
            })
            // loop through _nodes and check for duplicates and if there are duplicates keep the duplicate with the highest level
            const _nodes_unique = _nodes.reduce((acc, curr) => {
                if (!acc.some(node => node.id === curr.id)) {
                    acc.push(curr);
                } else {
                    const index = acc.findIndex(node => node.id === curr.id);
                    if (acc[index].level < curr.level) {
                        acc[index] = curr;
                    }
                }
                return acc;
            }, []);
            console.log(_nodes)
            console.log(_nodes_unique)
            dispatch(setNodes(_nodes_unique));
          }
          else {
            alert("Request failed for rbac_hierarchy")
            console.log(response.data)
          }
      }
      catch (error) {
        console.log(error)
        alert("error in rbac_hierarchy")
      }
    }

    const getDisconnectedNodes = async () =>{
      try {
        const response = await axios({
          method: 'post',
          url: `https://ww6g8cugsl.execute-api.ap-south-1.amazonaws.com/dev/independent_roles/`,
          data: {
            "userName":JSON.parse(localStorage.getItem('userCreds')).username,
            "password":JSON.parse(localStorage.getItem('userCreds')).password,
            "account":JSON.parse(localStorage.getItem('userCreds')).account
          },
          headers: {
            // 'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })
          if (response.data["flag"] == 1) {
            console.log("Disconnected Nodes from flask :", response.data);
            console.log(response.data["response"])
            const _edges = response.data["response"].map(edge=>{
              return({
                "id":`${edge["parentRole"]}_${edge["childRole"]}`,
                "source":edge["parentRole"],
                "target":edge["childRole"],
                "label":`${edge["parentRole"]}_${edge["childRole"]}`
              })
            })
            console.log("disconnected edges are : ",_edges);
            setDisconnectedEdges(_edges);
            // setEdges(_edges)
            const _nodes = response.data["response"].map((edge) => {
                return {"id": edge["childRole"], "label": edge["childRole"], "level": edge["level"],"env":edge["environment"]}
            })
            // loop through _nodes and check for duplicates and if there are duplicates keep the duplicate with the highest level
            const _nodes_unique = _nodes.reduce((acc, curr) => {
                if (!acc.some(node => node.id === curr.id)) {
                    acc.push(curr);
                } else {
                    const index = acc.findIndex(node => node.id === curr.id);
                    if (acc[index].level < curr.level) {
                        acc[index] = curr;
                    }
                }
                return acc;
            }, []);
            console.log(_nodes)
            console.log("disconnected nodes are : ",_nodes_unique)
            setDisconnectedNodes(_nodes_unique);
          }
          else {
            alert("Request failed for disconnected_nodes")
            console.log(response.data)
          }
      }
      catch (error) {
        console.log(error)
        alert("error in disconnected_nodes")
      }
    }

    const getAllNodes = async () => {
      try{
        const response_nodes = await axios({
          method: 'post',
          url: `https://ww6g8cugsl.execute-api.ap-south-1.amazonaws.com/dev/return_roles/`,
          data: {
            "userName":JSON.parse(localStorage.getItem('userCreds')).username,
            "password":JSON.parse(localStorage.getItem('userCreds')).password,
            "account":JSON.parse(localStorage.getItem('userCreds')).account
          },
          headers: {
              // 'Authorization': `bearer ${token}`,
              'Content-Type': 'application/json'
          },
        })
        if (response_nodes.data["flag"] == 1) {
          setAllNodes(response_nodes.data["response"].map(role => {
            return {"value": role.NAME, "label": role.NAME}
          }))
            
        }
        else {
          alert("Request failed for return_roles")
          console.log(response_nodes.data)
        }
      }
      catch (error) {
        console.log(error)
        alert("error in return_roles")
      }
    }
    const getUsers = async () => {
        try {
            const response = await axios({
                method: 'post',
                data: { 
                  "userName":JSON.parse(localStorage.getItem('userCreds')).username,
                  "password":JSON.parse(localStorage.getItem('userCreds')).password,
                  "account":JSON.parse(localStorage.getItem('userCreds')).account
                },
                url: `https://ww6g8cugsl.execute-api.ap-south-1.amazonaws.com/dev/return_users/`
            })
            if (response.data["flag"] == 1) {
              console.log(response.data["response"])
              setAllUsers(response.data["response"])  
            }
            else {
              console.log(response.data)
              alert("Request failed for return_users")  
            }
        }
        catch (error) {
            console.log(error)
            alert("error in return_users")
        }
    }

    const refreshTree = async () => {
      // refresh the graph with the getNodes getEdges and getDisconnectedNodes
      dispatch(setIsLoadingTreeOnly(true));
      Promise.allSettled([getNodes(),getDisconnectedNodes()]).then((values) => {
        dispatch(setIsLoadingTreeOnly(false));
      });
    }
    
    useEffect(()=>{
      dispatch(setIsLoadingTree(true));
      Promise.allSettled([getNodes(), getWarehouses(), getUsers(),getAllNodes(),getDisconnectedNodes()]).then((values) => {
        dispatch(setIsLoadingTree(false));
      });
      // getNodes().then(()=> {
      //   getWarehouses().then(()=>{
      //     getUsers().then((() => {
      //         getAllNodes().then(()=>{
      //             getDisconnectedNodes().then((() => {
      //               dispatch(setIsLoadingTree(false));
      //             }))
      //       })
      //     }))
      //   })
      // });
    },[])

    const handleDrawerOpen = () => {
      setOpen(true);
    };

    const handleDrawerClose = () => {
      setOpen(false);
    };

    const generatePDF = () => {
      takeScreenshot(ref1.current)
    }

    const logoutUser = () =>{
      localStorage.removeItem('userCreds');
      window.dispatchEvent(new Event("storage"));
      Swal.fire({
        title: "Logged out successfully",
        customClass: 'swal_alert__box',
        position:"center",
        icon: 'success',
        confirmButtonText: 'Okay',
        timer:'2000',
        timerProgressBar:true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
    }

    return (
      <>
      {isLoadingTree?
      <div style={{ display:"flex", height:"100vh", justifyContent:'center', alignItems:'center'}}>
        <ClipLoader color="#B2D942" size={150} />
      </div>:
      <div>
        <div>
          <AppBar style={{ width:"100vw"}}
          // position="fixed"
          open={open} sx={{ backgroundColor: "#072227" }}>
            <Toolbar style={{display:"flex", justifyContent:"space-between"}}>
              {/*<IconButton*/}
              {/*  color="inherit"*/}
              {/*  aria-label="open drawer"*/}
              {/*  onClick={handleDrawerOpen}*/}
              {/*  edge="start"*/}
              {/*  sx={{*/}
              {/*    marginRight: 5,*/}
              {/*    ...(open && { display: 'none' }),*/}
              {/*    color: "#AEFEFF",*/}
              {/*    paddingLeft: "18px",*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <MenuIcon />*/}
              {/*</IconButton>*/}
              {/*<Typography variant="h6" noWrap component="div" sx={{color: "#AEFEFF"}}>*/}
              {/*  RBAC*/}
              {/*</Typography>*/}
              <Toolbar style={{zIndex: 2}}>
                <img src={require('../assets/KIPI-Logo.webp')} alt="KIPI Logo" width={100} />
              </Toolbar>
              <Toolbar style={{zIndex: 2}}>
                <IconButton onClick={logoutUser}>
                <FontAwesomeIcon icon={faSignOutAlt}  style={{fontSize: "21px", color: "#AEFEFF"}}/>
                </IconButton>
                {/* <IconButton size="large">
                  <AccountCircle />
                </IconButton> */}
              </Toolbar>
            </Toolbar>
          </AppBar>
        </div>
        <div style={{display:"flex"
        // , height: "100%"
        }}>
          <div style={{flex: 0.2}}>
              <GraphSideBar getUsers={getUsers} getWarehouses={getWarehouses} getNodes={getNodes} allNodes={allNodes} getAllNodes={getAllNodes} getDisconnectedNodes={getDisconnectedNodes} allUsers={allUsers} warehouses={warehouses} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen} open={open} setOpen={setOpen} />
          </div>
          <div className="nodes__div" style={{display: "flex", justifyContent: "center", flexDirection:"column",
              // backgroundColor:"whitesmoke", 
              alignItems:"center", width: "100%", marginTop:"100px"}}>
            <Box sx={{ width: '100%' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
                centered
                TabIndicatorProps={{
                  style: {display: 'none'}
                }}
              >
                <Tab value="rbac" label="RBAC Hierarchy" />
                <Tab value="independent" label="Disconnected Roles" />
              </Tabs>
            </Box>
            {/* <div>
              <Button onClick={generatePDF} variant="contained">Download</Button>
            </div> */}
            <div style={{display: "flex",justifyContent: "center",marginTop: "30px",}}>
              <Button startIcon={<RefreshIcon />} style={{"marginRight": "100px"}} onClick={refreshTree}>Refresh</Button><Button startIcon={<DownloadIcon />} onClick={() => {alert("Sorry. This feature is not yet supported.")}}>Download</Button>
            </div>
            <div className="nodes__div" style={{display: "flex", justifyContent: "center",alignItems:"center", margin:"auto"}}>
              {tabValue=="rbac" && nodes && edges && <GraphView refreshTree={refreshTree} ref={ref1} nodes={nodes} edges={edges} warehouses={warehouses}/>}
              { tabValue=="independent" && <GraphView ref={ref2} refreshTree={refreshTree} nodes={disconnectedNodes} edges={disconnectedEdges} warehouses={warehouses}/>}
            </div>
          </div>
        </div>
      </div>
      }
      </>
    );
};

export default GraphPage;