import React from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export class ViewHomework extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            subject:this.props.match.params.sub,
            defPath : '/homework',
            path:[],
        }
    }
    componentWillMount(){
           axios.get('http://localhost:4495/hwOption/'+this.state.subject+'/'+this.state.user).then((f) => {
               var path = this.state.defPath;
               var subject = this.state.subject;
               var x = [];
               console.log(f);
               if(f !== null)
               {
                for(let q in f.data)
                {
                    let y = path.concat("/").concat(subject).concat("/").concat(f.data[q].name);
                    let z = f.data[q].name.split(".");
                    let t = z[0];
                    let prop = {
                        date:new Date(f.data[q].date),
                        url:y,
                        dispName:t
                    }
                    console.log(prop);
                    x.push(prop);
                }
                }
            this.setState({
                path:x
            })
            console.log(x);
           })

    }

    render(){
        return(
             this.state.redirect ? <Redirect to ="/target" /> :
            <div> <h3>Welcome to {this.props.match.params.sub} </h3>
            <br/>
            <h4>Homework section</h4>
            { this.state.path.length > 0 ? <p>
            {
                    this.state.path.map((value,index) => {
                        return(
                        
                            <div className="card">
                            <div className="card-body">
                              <h5 className="card-title"><a href={'/homeworkUpload/' + this.state.subject + '/' + value.dispName}>{value.dispName}</a></h5>
                              <br/>
                              Homework Question
                              <br/>
                              <a href={value.url} download> {value.dispName} </a>
                              Deadline : {value.date.getFullYear() + '-' + (value.date.getMonth()+1) + '-'+value.date.getDate()} at {value.date.getHours()}:{value.date.getMinutes()}
                            </div>
                          </div>
                    )
                })
             }
             </p> : <p>You are at right place but we have no homework by Professor</p>
            }
            </div>
        )
    }

}