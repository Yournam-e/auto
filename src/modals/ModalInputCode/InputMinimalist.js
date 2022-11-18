import {Input} from "@vkontakte/vkui";
import './style.css';

import React, { useEffect, useState } from 'react';
class InputMinimalist extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        const value = e.target.value.toUpperCase();
        this.setState({value});
        if (this.props.onChange && typeof this.props.onChange === 'function')
            this.props.onChange(value);
    }

    render() {
        const
            {value} = this.state,
            {placeholder, defaultValue, maxLength} = this.props
        ;
        return <Input
            value={value}
            onChange={this.onChange}
            placeholder={placeholder}
            defaultValue={defaultValue}
            maxLength={maxLength}
        />
    }

}

export default InputMinimalist
