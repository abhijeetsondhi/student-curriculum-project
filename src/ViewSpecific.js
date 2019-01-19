import React from "react";
import axios from 'axios';

export class ViewSpecific extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            subject:this.props.match.params.sub,
            name:this.props.match.params.name,
            defPath : '/teacher/',
            path:[],
        }
    }
    componentWillMount(){
           axios.get('http://localhost:4495/viewSpecific/'+this.state.subject+'/'+this.state.name).then((f) => {
                if(f){
                    console.log(f);
                    let res = [];
                    for(let x of f.data)
                    {
                        let y = x.file;
                        y = this.state.defPath.concat(this.state.subject).concat('/').concat(this.state.name).concat('/').concat(x.upload).concat('/').concat(y);
                        res.push({
                            name:x.upload,
                            path:y
                            })
                    }
                    this.setState({
                        path:res
                    })
                    }    
           })
    }

    render(){
        return(
            <div> 
                <h3>Welcome to {this.state.name} </h3>
            <br/>
            <h4>{this.state.name}'s Work</h4>
            { 
                this.state.path.length > 0 ? <p>
            {
                    this.state.path.map((value,index) => {
                        return(
                        
                            <div className="card">
                            <div className="card-body">
                              <h5 className="card-title">{value.name}</h5>
                              <a href={value.path} download>{value.name}</a>
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