import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { decrement, fetchUserDetails, increment, incrementByAmount } from "../redux/mainStore";

const Temp = () => {

    const dispatch = useDispatch();
    const { count,user,loading } = useSelector(state=>state.mainSlice);


    return (
        <div>
        {loading && <p>Loading</p>}
        {user && <h1>Hi {user.first_name+" "+user.last_name} !</h1>}
        <h1>The count is {count}</h1>
        <button onClick={()=>{dispatch(increment())}}>increment</button>
        <button onClick={()=>{dispatch(decrement())}}>decrement</button>
        <button onClick={()=>{dispatch(incrementByAmount(5))}}>increment by 5</button>
      </div>
    );
};

export default Temp;