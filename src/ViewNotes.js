import React from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export class ViewNotes extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            subject:this.props.match.params.sub,
            defPath : '/subject',
            path:[],
        }
    }
    componentWillMount(){
           axios.get('http://localhost:4495/notes/'+this.state.subject).then((f) => {
               var path = this.state.defPath;
               var subject = this.state.subject;
               var x = [];
               if(f !== null)
               {
                for(let q in f.data)
                {
                    let y = path.concat("/").concat(subject).concat("/").concat(f.data[q]);
                    let z = f.data[q].split(".");
                    let t = z[0];
                    let prop = {
                        name:f.data[q],
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
            <h4>Notes section</h4>
            { this.state.path.length > 0 ? <p>
            {
                    this.state.path.map((value,index) => {
                        return(
                        
                            <div className="card">
                            <div className="card-body">
                              <h5 className="card-title">{value.dispName}</h5>
                              <a href={value.url} download> {value.name} </a>
                            </div>
                          </div>
                    )
                })
             }
             </p> : <p>You are at right place but we have no notes by Professor</p>
            }
            </div>
        )
    }

}