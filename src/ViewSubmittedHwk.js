import React from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export class ViewSubmittedHwk extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            subject:this.props.match.params.sub,
            defPath : '/subject',
            subjectName:" ",
            path:[],
        }
    }
    componentWillMount(){
        var subjectName = this.state.subject + " " + "by" + " " + this.state.user
        this.setState({
            subjectName:subjectName
        })
           axios.get('http://localhost:4495/viewSubmit/'+subjectName).then((f) => {
                if(f){
                    this.setState({
                        path:f.data
                    })
                }
           })

    }

    render(){
        return(
             this.state.redirect ? <Redirect to ="/target" /> :
            <div> <h3>Welcome to {this.props.match.params.sub} </h3>
            <br/>
            <h4>Students submitted their work</h4>
            { this.state.path.length > 0 ? <p>
            {
                    this.state.path.map((value,index) => {
                        return(
                            <div className="card">
                                <div className="card-body">
                              < h5 className="card-title">{value}</h5>
                              <a href={'/viewSpecific/'+ this.state.subjectName +'/'+value}> View Submitted Work </a>
                            </div>
                          </div>
                    )
                })
             }
             </p> : <p>You are at right place but we have no submission</p>
            }
            </div>
        )
    }

}