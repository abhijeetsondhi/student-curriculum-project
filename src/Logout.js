import React from "react";
import { Redirect } from 'react-router-dom'
export class Logout extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            user:localStorage.getItem("user"),
            redirect:false
        };
       
    }

    componentWillMount()
    {
        if(localStorage)
        {
            localStorage.clear();
        }
        this.setState({
            redirect:true
        })
    }

    render()
    {
        return(
            this.state.redirect ? <Redirect to='/'/> : <div> No op </div>
        )
    }
}