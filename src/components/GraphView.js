import React, {useEffect, useState} from "react"
import Xarrow from 'react-xarrows';
import {useDispatch, useSelector} from "react-redux";
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import StyledBootstrapDialogTitle from "./StyledBootstrapDialogTitle";
import Dialog from '@mui/material/Dialog';
import RefreshIcon from '@mui/icons-material/Refresh';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';
import './GraphView.css';
import UserRoleAssigner from "./UserRoleAssigner";
import {assignUser, revokeUser} from "../redux/mainStore";
import {ModalStyledButton} from "./ModalStyledButton";
import axios from "axios";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  }, '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  //  ' .MuiDialogTitle-root': {
  //   margin: "auto", fontWeight: "600"
  // }, ' .MuiTypography-body2': {
  //   fontWeight: "700"
  // }
}));

// const StyledBootstrapDialogTitle = (props) => {
//   const {children, onClose, ...other} = props;

//   return (<DialogTitle sx={{m: 0, p: 2}} {...other}>
//       {children}
//       {onClose ? (<IconButton
//           aria-label="close"
//           onClick={onClose}
//           sx={{
//             position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500],
//           }}
//         >
//           <CloseIcon/>
//         </IconButton>) : null}
//     </DialogTitle>);
// };

// StyledBootstrapDialogTitle.propTypes = {
//   children: PropTypes.node, onClose: PropTypes.func.isRequired,
// };

const Accordion = styled((props) => (<MuiAccordion disableGutters elevation={0} square {...props} />))(({theme}) => ({
  border: `1px solid ${theme.palette.divider}`, '&:not(:last-child)': {
    borderBottom: 0,
  }, '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (<MuiAccordionSummary
  expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>}
  {...props}
/>))(({theme}) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
  padding: theme.spacing(2), borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


function GraphView({nodes,edges,warehouses,refreshTree}) {

  const ColorButton = styled(Button)(() => ({
    // color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "#146356", borderRadius: "12px", '&:hover': {
      backgroundColor: "#115549",
    },
  }));

  const {userRoles, allUsers, isLoadingTree, isLoadingTreeOnly} = useSelector(state => state.mainSlice);
  const dispatch = useDispatch();

  const [token, setToken] = React.useState(null);
  const [uniqueLevels, setUniqueLevels] = React.useState([]);
  const [rowWidth, setRowWidth] = React.useState("100px");
  const [encodedClientId, setEncodedClientId] = React.useState(null);
  const [encodedRedirectUri, setEncodedRedirectUri] = React.useState(null);
  const [encodedClientSecret, setEncodedClientSecret] = React.useState(null);
  const [selectedNode, setSelectedNode] = React.useState(null)
  const [hoveredNode, setHoveredNode] = React.useState(null)
  const [hoveredEdge, setHoveredEdge] = React.useState(null)
  const [selectedNodeChildren, setSelectedNodeChildren] = useState([])
  const [selectedNodeParents, setSelectedNodeParents] = useState([])
  const [selectedNodeUsers, setSelectedNodeUsers] = useState([])
  const [openViewRole, setopenViewRole] = React.useState(false);
  const [expandedAccordion, setExpandedAccordion] = React.useState('panel1');
  const [openRoleAssigner, setOpenRoleAssigner] = React.useState(false);
  const [nodeDetailsLoading, setNodeDetailsLoading] = React.useState(false);

  const handleChangeAccordion = (panel) => (event, newExpanded) => {
    setExpandedAccordion(newExpanded ? panel : false);
  };

  const getSelectedNodeUsers = (node)=>{
    setNodeDetailsLoading(true)
    axios({
      method: 'post',
      url: `https://ww6g8cugsl.execute-api.ap-south-1.amazonaws.com/dev/return_users_of_role/`,
      data: { 
        "userName":JSON.parse(localStorage.getItem('userCreds')).username,
        "password":JSON.parse(localStorage.getItem('userCreds')).password,
        "account":JSON.parse(localStorage.getItem('userCreds')).account,
        "data":[node.label]
      }
      ,
      headers: {
        // 'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
    .then((response) => {
      setNodeDetailsLoading(false)
      console.log("Get users of role response :", response);
      if(response.data.flag==1){
        setSelectedNodeUsers(response.data.response)
      }
    })
    .catch((error) => {
      setNodeDetailsLoading(false)
      console.log(error)
      alert(error)
      alert("Could not fetch users of the role")
    })
  }

  const nodeOnClick = (node) => {
    console.log(node)
    setSelectedNode(node)
    setopenViewRole(true);
    var children = edges.filter(edge => edge.source === node.label).map(e => e.target)
    console.log("Children are : ", children)
    setSelectedNodeChildren(children)
    var parents = edges.filter(edge => (edge.target === node.label && edge.source!="NULL")).map(e => e.source)
    console.log("Parents are : ", parents)
    setSelectedNodeParents(parents)
    getSelectedNodeUsers(node)
  }

  const getChildrenInLevelN = (node, index) => {
    var children = edges.filter(edge => {
      return (edge.source === node)
    }).map(e => e.target)
    console.log("children of ", node, "are :", children)
    var childrenInLevelN = nodes.filter(Node => {
      return (children.includes(Node.label) && Node.level === index)
    })
    console.log("childrenInLevelN are :", childrenInLevelN)
    return (childrenInLevelN)
  }

  const renderNodesInLevel = (index) => {
    // console.log("in level :", index)
    var result = [];
    var _nodes = []
    if (index > 0) {
      nodes.filter(n => n.level === index - 1).map(n => {
        console.log("for node n:", n)
        var a = getChildrenInLevelN(n.label, index)
        _nodes = [..._nodes, ...a]

      })
    } else {
      _nodes = nodes.filter(_n => _n.level === 0)
    }
    _nodes = nodes.filter(_n => _n.level === index)
    _nodes.map(n => {
      result.push(
        <div className="node" id={n.id + "DIv"} style={{
          width: "max-content",
          borderRadius: "15px"
        }}>
          <ColorButton
            id={n.id}
            onClick={() => nodeOnClick(n)}
            onMouseEnter={() => setHoveredNode(n)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{
              color: "white", textTransform: 'none'
            }}
          >{n.label}</ColorButton>
        </div>)
    })
    return result
  }

  const recursiveFind = (array, search) => {
    var result = []
    array.map(node => {
      if (node === search) {
        result.push(node)
      }
      if (node.children) {
        var a = recursiveFind(node.children, search)
        result = [...result, ...a]
      }
    })
    return result
  }
  const handleCloseRoleAssigner = () => {
    setOpenRoleAssigner(false);
  }
  const countAllChildrenBelowNode = (node) => {
    let count = [];
    let children = edges.filter(edge => {
      return (edge.source === node)
    }).map(e => e.target)
    children.map(child => {
      if (!count.includes(child)) {
        count = [...count, ...countAllChildrenBelowNode(child)]
      }
    })
    count = [...count, ...children]
    return [...new Set(count)]
  }

  const countAllChildrenBelowLevel = (level) => {
    let count = [];
    nodes.filter(n => n.level === level).map(n => {
      count = [...count, ...countAllChildrenBelowNode(n.label)]
    })
    return [...new Set(count)];
  }

  const groupNodesInLevel = (level) => {
    if (level === 0) {
      let _nodes = nodes.filter(node => node.level === level);
      let result = [];
      _nodes.map(node => {
        result.push({node: {...node}, index: _nodes.findIndex(n => n.level === level)})
      })
      return result;
    }
    let result = [];
    let indexes = []
    let nodesInLevel = nodes.filter(node => node.level === level);
    nodesInLevel.map(node => {
      let parents = edges.filter(edge => edge.target === node.label);
      let nodesInLevelAbove = nodes.filter(node => node.level === level - 1);
      let parentIndex = 0;
      parents.map(parent => {
        parentIndex += groupNodesInLevel(level - 1).findIndex(node => node.node.label === parent.source)
      })
      parentIndex = parentIndex / parents.length;
      indexes.push({node: {...node}, index: parentIndex});
    })
    indexes.sort((a, b) => a.index - b.index);
    return indexes;
  }

  const addNodeWidths = (level) => {
    if (level === 0) {
      const _nodes = groupNodesInLevel(level);
      let result = [];
      _nodes.map(node => {
        result.push({...node, width: (countAllChildrenBelowNode(node.label).length+1)*100/(countAllChildrenBelowLevel(level).length+_nodes.length)})
      })
      return result;
    }
    const _nodes = groupNodesInLevel(level);
    let result = [];
    _nodes.map(node => {
      result.push({...node, width: (countAllChildrenBelowNode(node.node.label).length+1)*100/(countAllChildrenBelowLevel(level).length+_nodes.length)})
    })
    return result;
  }

  const getNodeBackgroundColor = (env)=>{
    if(env=="dev")
      return "#187498"
    else if(env=="qa")
      return "#EFD345"
    else if(env=="prod")
     return "#36AE7C"
    else if(env=="system")
      return "#EE5007"
    else
      return "#D7A86E"
  }

  const displayNodesInLevel = (level) => {
    const _nodes = addNodeWidths(level);
    const result = [];
    _nodes.map(index => {
      result.push(<div className="node" id={index.node.id + "DIv"} style={{
        width: index.width+"%", borderRadius: "15px"
      }}>
        <ColorButton
          className="rbac__node"
          id={index.node.id}
          onClick={() => nodeOnClick(index.node)}
          onMouseEnter={() => setHoveredNode(index.node)}
          onMouseLeave={() => setHoveredNode(null)}
          style={{
            color: "white", textTransform: 'none',
            zIndex:"2",
            backgroundColor:getNodeBackgroundColor(index.node.env)
          }}
        >{index.node.label}</ColorButton>
      </div>)
    })
    return result;
  }

  const renderNodes = uniqueLevels.map(l => {
    return (<div className="row" id={"row" + l} style={{width: `${rowWidth}`}}>
        {displayNodesInLevel(l)}
      </div>)
  })

  const getEdgeColor = (edge) => {
    if (hoveredEdge != null && hoveredEdge.id === edge.id) {
      return ("#0d4037")
    } else if (hoveredNode != null) {
      if (hoveredNode.label === edge.source || hoveredNode.label === edge.target) {
        return ("#0d4037")
      }
    }
    return ("lightgray")
  }

  const getZIndex = (edge) => {
    if (hoveredEdge != null && hoveredEdge.id === edge.id) {
      return (1)
    } else if (hoveredNode != null) {
      if (hoveredNode.label === edge.source || hoveredNode.label === edge.target) {
        return (1)
      }
    }
    return (0)
  }

  const displayEdges = edges.filter((edge) => {return (edge.source !== "NULL" && edge.target !== "NULL")}).map((edge, index) => {
    // console.log(edge)
    return (<Xarrow
        key={Math.random()}
        id={edge.id}
        // arrow is purposefully kept from end to start due to snowflake use case
        end={edge.source} //can be react ref or an id
        start={edge.target}
        startAnchor="top"
        endAnchor="bottom"
        color={getEdgeColor(edge)}
        strokeWidth={3}
        path="curve"
        zIndex={getZIndex(edge)}
        passProps={{
          cursor: "pointer",
          // onMouseEnter: () => setHoveredEdge(edge),
          // onMouseLeave: () => setHoveredEdge(null)
        }}
      />)
  })

  useEffect(() => {
    var _uniqueLevels = [...new Set(nodes.map(node => node.level))].filter(item => item !== -1).sort()
    var _uniqueLevelsLength = _uniqueLevels.length;
    console.log("_uniqueLevels : ",_uniqueLevels)
    setUniqueLevels(_uniqueLevels)
    const arr = nodes.map(n => n.level);
    const counts = arr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    var countsArr = [...counts.values()]
    setRowWidth(Math.max(...countsArr) * 236 + 10 + "px")
  }, [nodes, edges])

  const handleCloseViewRole = () => {
    setopenViewRole(false);
    setSelectedNode(null);
    setHoveredNode(null)
  };

  const displayParentsOrChildrenOrUsers = (nodesArray) => nodesArray.map(node => {
    return (<Typography variant="body2">
        {node}
      </Typography>)
  })



  return (    
    <div id="container">
     {/* style={{border:"3px solid grey"}}> */}
      {!isLoadingTree ?
          <>
          {/* <div style={{display:"flex", justifyContent:"space-around"}}>
          <button>Refresh</button>
          <button>Download</button>            
          </div> */}
            <div style={{ display:"flex",justifyContent:'center'}}>
                <ul class="legend">
                  <li><span class="dev"></span> DEV ROLE</li>
                  <li><span class="qa"></span> QA ROLE</li>
                  <li><span class="prod"></span> PROD ROLE</li>
                  <li><span class="system"></span> SYSTEM ROLE</li>
                  <li><span class="unassigned"></span> UNASSIGNED ROLE</li>
                </ul>
            </div>
            <div className="gridContainer">
              {!isLoadingTreeOnly ? <>

              {renderNodes}
              {displayEdges}
              </>
                : <div style={{ display:"flex", height:"70vh", justifyContent:'center', alignItems:'center'}}>
                <ClipLoader color="#B2D942" size={150} />
                </div>
              }
            </div>
            {/* <div> */}
              {/* {renderNodes}       */}
              {/* {displayEdges} */}
            {/* </div> */}
          </>
        : <div style={{ display:"flex", height:"100vh", justifyContent:'center', alignItems:'center'}}>
            <ClipLoader color="#B2D942" size={150} />
          </div>
      }
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        PaperProps={{
          style: {
            width: "800px", height: "400px"
          },
        }}
        onClose={handleCloseViewRole}
        open={openViewRole}
      >
        <StyledBootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseViewRole}>
          {selectedNode && selectedNode.label}
        </StyledBootstrapDialogTitle>
        <DialogContent dividers>
          {nodeDetailsLoading?
          <div style={{ width:"100%", height: "100%", display:"flex", justifyContent:'center', alignItems:'center'}}>
            <ClipLoader color="#B2D942" size={90} />
          </div> :
          <>
          <Accordion expanded={expandedAccordion === 'parents'} onChange={handleChangeAccordion('parents')}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
              <Typography variant="body1" gutterBottom>Granted to Roles (Parents)
                : {selectedNodeParents.length}</Typography>
            </AccordionSummary>
            <AccordionDetails>{displayParentsOrChildrenOrUsers(selectedNodeParents)}</AccordionDetails>
          </Accordion>
          <Accordion expanded={expandedAccordion === 'children'} onChange={handleChangeAccordion('children')}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
              <Typography variant="body1" gutterBottom>Granted Roles (Children)
                : {selectedNodeChildren.length}</Typography>
            </AccordionSummary>
            <AccordionDetails>{displayParentsOrChildrenOrUsers(selectedNodeChildren)}</AccordionDetails>
          </Accordion>
          <Accordion expanded={expandedAccordion === 'users'} onChange={handleChangeAccordion('users')}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
              <Typography variant="body1" gutterBottom>Granted Users
                : {selectedNodeUsers.length}</Typography>
            </AccordionSummary>
            <AccordionDetails>{displayParentsOrChildrenOrUsers(selectedNodeUsers)}</AccordionDetails>
          </Accordion>
          </>
          }
        </DialogContent>
        <DialogActions>
          <ModalStyledButton autoFocus onClick={handleCloseViewRole} type="cancel">
            Close
          </ModalStyledButton>
        </DialogActions>
      </BootstrapDialog>
      <BootstrapDialog
        onClose={handleCloseRoleAssigner}
        aria-labelledby="customized-dialog-title"
        open={openRoleAssigner}
        PaperProps={{
          style: {
          },
        }}
      >
        <StyledBootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseRoleAssigner}>
          Assign User to { selectedNode && selectedNode.value }
        </StyledBootstrapDialogTitle>
        <DialogContent dividers>
          <div style={{padding:"0px 56px"}}>
            <UserRoleAssigner dispatch={dispatch} allUsers={allUsers} userRoles={userRoles} assignUser={assignUser} revokeUser={revokeUser} selectedNode={selectedNode} />
          </div>
        </DialogContent>
        <DialogActions>
          <ModalStyledButton autoFocus onClick={handleCloseRoleAssigner} type="cancel">
            Close
          </ModalStyledButton>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );

}

export default GraphView;
