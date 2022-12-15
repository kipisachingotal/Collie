import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  count: 0,
  loading:false,
  isLoadingTree:true,
  isLoadingTreeOnly:false,
  isSuccess:false,
  user : null ,
  message : "",
  nodes:[],
  edges:[],
  f:[],
  userRoles:[
    { role:"AccountAdmin", users:["Madhivanan","Sumit","Suhas","Ashwani"] },
    { role:"SysAdmin", users:["Madhivanan","Shobhit", "Harshini","Sumit","Suhas","Ashwani"] },
    { role:"UserAdmin", users:["Madhivanan","Sumit","Suhas","Ashwani","Nikhil","Vishal"] },
    { role:"SecurityAdmin", users:["Madhivanan","Yuktha", "Harshini","Suhas","Ashwani"] },
    { role:"MuleAdmin", users:["Madhivanan","Shobhit", "Yuktha", "Harshini","Sumit","Suhas","Ashwani","Nikhil"] },
    { role:"SfdcAdmin", users:["Madhivanan","Shobhit", "Yuktha", "Harshini","Sumit","Suhas","Ashwani","Satyajit"] },
    { role:"MuleETL", users:["Madhivanan","Shobhit", "Yuktha", "Harshini","Sumit","Suhas","Ashwani","Nikhil"] },
    { role:"SfdcETL", users:["Madhivanan","Shobhit", "Yuktha", "Harshini","Sumit","Suhas","Ashwani","Satyajit"] },
    { role:"MuleAnalyst", users:["Madhivanan","Shobhit", "Yuktha", "Harshini","Sumit","Suhas","Ashwani","Nikhil","Vishal"] },
    { role:"SfdcAnalyst", users:["Madhivanan","Shobhit", "Yuktha", "Harshini","Sumit","Suhas","Ashwani","Anjana","Satyajit"] },
    { role:"MuleRead", users:["Madhivanan","Shobhit", "Yuktha", "Harshini","Sumit","Suhas","Ashwani","Nikhil","Vishal"] },
    { role:"MuleWrite", users:["Madhivanan","Shobhit", "Yuktha", "Harshini","Sumit","Suhas","Ashwani","Nikhil"] },
    { role:"SfdcRead", users:["Madhivanan","Shobhit", "Yuktha", "Harshini","Sumit","Suhas","Ashwani","Anjana","Satyajit"] },
    { role:"SfdcWrite", users:["Madhivanan","Shobhit", "Yuktha", "Harshini","Sumit","Suhas","Ashwani","Satyajit"] },
    { role:"SfdcABC", users:["Madhivanan","Shobhit", "Yuktha", "Harshini","Sumit","Suhas","Ashwani","Nikhil","Vishal","Anjana","Satyajit"] },
  ],
  allUsers: ["Madhivanan","Shobhit", "Yuktha", "Harshini","Sumit","Suhas","Ashwani","Nikhil","Vishal","Anjana","Satyajit"],
  accessDetails:null
}

export const fetchUserDetails = createAsyncThunk('mainSlice/getData', async (args,{rejectWithValue}) => {
    try{
      const response = await axios.get("https://reqres.in/api/users/1")
      return response.data.data
    }
    catch(error){
      rejectWithValue(error.response.data)
    }
  }
)

export const mainSlice = createSlice({
  name: 'mainSlice',
  initialState:initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("Setting user to : ", action.payload)
      state.user = action.payload
    },
    setTagValues: (state, action) => {
      state.tag_values = [...action.payload]
    },
    setNodes: (state, action) => {
      state.nodes = [...action.payload]
    },
    setEdges: (state, action) => {
      state.edges = [...action.payload]
    },
    setIsLoadingTree: (state, action) => {
      state.isLoadingTree = action.payload
    },
    setIsLoadingTreeOnly: (state, action) => {
      state.isLoadingTreeOnly = action.payload
    },
    setLevel: (state,action) => {
      var a = state.nodes.findIndex(n=>{return(n).label==(action.payload.label)})
      var arr = state.nodes
      arr[a].level=action.payload.level
      state.nodes=arr
    },
    assignUser: (state, action) => {
      var a = state.userRoles.findIndex(n=>{return(n).role==(action.payload.role)})
      var arr = state.userRoles
      arr[a].users.push(action.payload.user.name)
      state.userRoles=arr
      console.log(arr)
    },
    revokeUser: (state, action) => {
      var a = state.userRoles.findIndex(n=>{return(n).role==(action.payload.role)})
      var arr = state.userRoles
      arr[a].users.splice(arr[a].users.indexOf(action.payload.user.name),1)
      state.userRoles=arr
      console.log(arr)
    },
    removeEdges: (state,action) => {
      var labels =action.payload.map(p=>p.label)
      var arr = state.users.filter(e=>{return(!e.includes(e.label))})
      state.edges = arr
    },
    increment: (state) => {
      state.count += 1
    },
    decrement: (state) => {
      state.count -= 1
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload
    },
    setAccessDetails: (state,action) => {
      state.accessDetails = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserDetails.pending, (state, action) => {
      state.loading=true;
    })

    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.loading=false;
      state.user=action.payload;
      state.isSuccess=true
    })

    builder.addCase(fetchUserDetails.rejected, (state, action) => {
      state.loading=false;
      state.isSuccess=false;
      state.message=action.payload
    })
  },

  // extraReducers:  {
  //   [fetchUserDetails.pending]: (state,{payload})  =>{
  //     state.loading=true;
  //   },
  //   [fetchUserDetails.fulfilled]: (state,{payload})  =>{
  //     state.loading=false;
  //     state.user=payload;
  //     state.isSuccess=true
  //   },
  //   [fetchUserDetails.rejected]: (state,{payload})  =>{
  //     state.loading=false;
  //     state.isSuccess=false;
  //     state.message=payload
  //   },

  // }
})

// Action creators are generated for each case reducer function
export const { increment, decrement, setIsLoadingTreeOnly, incrementByAmount,setUser,setTagValues, setNodes, setIsLoadingTree, assignUser, revokeUser, setEdges, setLevel, removeEdges, setAccessDetails } = mainSlice.actions

export default mainSlice.reducer