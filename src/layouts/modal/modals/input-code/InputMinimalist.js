import { Input } from "@vkontakte/vkui";
import "./style.css";

import React from "react";
import { isEnglishAndNumericOnly } from "../../../../scripts/inputMask";
class InputMinimalist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const value = e.target.value;
    if (isEnglishAndNumericOnly(value)) {
      this.setState({ value });
      if (this.props.onChange && typeof this.props.onChange === "function") {
        this.props.onChange(value);
      }
    }
  }

  render() {
    const { value } = this.state,
      { placeholder, defaultValue, maxLength, onKeyUp } = this.props;
    return (
      <Input
        lang="en"
        className="textInput"
        value={value}
        onChange={this.onChange}
        onKeyUp={onKeyUp}
        placeholder={placeholder}
        defaultValue={defaultValue}
        maxLength={maxLength}
      />
    );
  }
}

export default InputMinimalist;
