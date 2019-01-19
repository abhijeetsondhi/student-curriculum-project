import React from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
 
export default class Input extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            score:props.initialValue,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps)
    {
        console.log(nextProps.initialValue);
        this.setState({
            score:nextProps.initialValue
        })
    }

    handleChange(event)
    {
        this.setState({
            
            [event.target.name] : event.target.value,
        });
        
        var name = event.target.name;
        var value = event.target.value;
        this.props.addValue(name,value);
    }

    render()
    {
        return(
            <input type="text" name={this.props.name} defaultValue={this.state.score} value={this.state.value1} onChange={(event) => this.handleChange(event)}/>


        );
    }

}
Input.propTypes = {
initialValue : PropTypes.number,
name : PropTypes.string,
addValue : PropTypes.func,
};  
