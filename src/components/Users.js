import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { decrement, fetchUserDetails, increment, incrementByAmount } from "../redux/mainStore";
import "./Users.css"
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { IconButton } from "@mui/material";
import Button from '@mui/material/Button';
import axios from "axios"

const Users = () => {

    const dispatch = useDispatch();
    const { count,users,loading,accessDetails } = useSelector(state=>state.mainSlice);
    const [ users1,setUsers1] = useState([
        {name:"User0", selected:false},
        {name:"User1", selected:false},
        {name:"User2", selected:false},
        {name:"User3", selected:false},
        {name:"User4", selected:false}
    ])
    const [ users2,setUsers2] = useState([
        {name:"User5", selected:false},
        {name:"User6", selected:false},
        {name:"User7", selected:false}
    ])

    const getVariant = (user) =>{
        if(user.selected){
            return "contained"
        }
        else{
            return "outlined"
        }
    }

    const user1OnClick = (user) =>{
        var users = users1;
        var  i = users.findIndex(u=>u==user)
        console.log("Index is : ",i)
        console.log("Users1 is : ", users1)
        users1[i].selected = true
        console.log("Users1 is : ", users1)
        setUsers1(users)
    }

    const showUser1 = users1.map(user=>{
        return (
            <div>
            <Button onClick={()=>user1OnClick(user)} variant={getVariant(user)}>{user.name}</Button>
            {/* <div>{user}</div> */}
            </div>
        )
    })

    const showUser2 = users2.map(user=>{
        return (
            <div>
            <Button variant="outlined">{user.name}</Button>
            {/* <div>{user}</div> */}
            </div>
        )
    })

    const callApi = () =>{

    }

    return (
        <div>
            <button onClick={callApi}>Call API</button>
            <p> Modify Users</p>
            <div className="main-container">
                <div className="users-container">
                    <div className="available-users-container">
                        {showUser1}
                    </div>
                    <div className="move-users">
                        <div>
                            <IconButton><ArrowRightAltIcon /></IconButton>
                        </div>
                        <div>
                            <IconButton><KeyboardBackspaceIcon /></IconButton>
                        </div>
                    </div>
                    <div className="selected-users-container">
                        {showUser2}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;