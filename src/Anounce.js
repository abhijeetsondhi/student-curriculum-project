import React from "react";
import axios from 'axios';
export class Anounce extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            posts:" ",
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            subject:"",
            post:[]
        }
    }

    componentWillMount()
    {
        let posts = [];
        let subj = this.props.match.params.sub;
        console.log(subj);
        axios.get('http://localhost:4495/postSubject/' + subj).then((f) => {
            if(f.length !== null)
            {
                console.log(this.state.subject);
                for(var x in f.data)
                {
                    posts.push(f.data[x]);
                }
                this.setState({
                    post:posts,
                    subject:subj
                })
                console.log(posts);
            }
        });
    }

    render(){
        return(
            <div> 
                Welcome to {this.props.match.params.sub} 
            <br/>
            <br/>
            {this.state.post.length >= 1 ? 
            <ul className="list-group">
                { this.state.post.map((value,index) => {
                    return(
                        <div>
                           <li className="list-group-item"> {value}</li>
                            </div>
                    )
                }) }
                </ul>
                : <p> There is no announcement by the professor </p>}
            </div>
        );
    }

}