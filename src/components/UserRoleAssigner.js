import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import SearchableDataGrid from "./SearchableDataGrid";
import Button from "@mui/material/Button";
import {styled} from "@mui/material";


const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
  },

];

const ButtonStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'inline-grid',
  [theme.breakpoints.down('md')]: {
    display: 'inline'
  },
}));


function  UserRoleAssigner({ dispatch, userRoles, allUsers, assignUser, revokeUser, selectedNode }) {
  const [selectedUsers, setSelectedUsers] = useState([{
    users: [],
    nodeUsers: [],
  }]);
  console.log(selectedUsers);
  const [_nodeUsers, _setNodeUsers] = useState(["A","B","C","X","Y","Z"]);
  const [_allUsers, _setAllUsers] = useState(["1","2","3","4"]);
  useEffect(() => {
    // _setNodeUsers([...userRoles.filter(role => role.role === selectedNode.id)[0].users]);
    // _setAllUsers([...allUsers.filter(user => !userRoles.filter(role => role.role === selectedNode.id)[0].users.includes(user))]);
  }, [userRoles, allUsers, selectedNode]);

  const handleLeftTransfer = () => {
    if (selectedUsers.nodeUsers) {
      selectedUsers.nodeUsers.forEach(user => {
        dispatch(revokeUser({
          role: selectedNode.id,
          user: user,
        }));
      });
      setSelectedUsers({
        users: [],
        nodeUsers: [],
      });
    }
  }

  const handleRightTransfer = () => {
    console.log(selectedUsers)
    if (selectedUsers.users) {
      if (selectedUsers.users.some(user => userRoles.filter(role=>role.role===selectedNode.id).includes(user))) {
        alert('You cannot assign a user that is already assigned to this role');
        return;
      }
      selectedUsers.users.forEach(user => {
        dispatch(assignUser({
          role: selectedNode.id,
          user: user,
        }));
      });
      setSelectedUsers({
        users: [],
        nodeUsers: [],
      });
    }
  }


  return (
    <Box id="userAssignerRoot">
      <Box id="usersTable" sx={{width: '45%'}}>
        <SearchableDataGrid data={_allUsers} setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers} columns={columns} type='users'/>
      </Box>

      <Box id="transferButtons" sx={{width: '10%', marginY: 'auto', alignItems: 'center'}}>
        <Box style={{display: 'flex', justifyContent: 'center'}}>
          <ButtonStyle>
            <Button onClick={handleLeftTransfer} sx={{mt: 'auto'}}><i className='bi bi-arrow-left horizontalIcon' style={{fontSize: 30}}/><i className='bi bi-arrow-up verticalIcon' style={{fontSize: 30}}/></Button>
            <Button onClick={handleRightTransfer} sx={{mb: 'auto'}}><i className='bi bi-arrow-right horizontalIcon' style={{fontSize: 30}} /><i className='bi bi-arrow-down verticalIcon' style={{fontSize: 30}} /></Button>
          </ButtonStyle>
        </Box>

      </Box>
      <Box id="nodeUsersTable" sx={{width: '45%'}}>
        <SearchableDataGrid data={_nodeUsers} setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers} columns={columns} type='nodeUsers'/>
      </Box>
    </Box>
  );
}

export default UserRoleAssigner;