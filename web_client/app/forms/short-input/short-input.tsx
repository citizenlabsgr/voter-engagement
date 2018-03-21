import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
const dashify = require('dashify') as (s: string) => string;
import { func } from 'prop-types';

// Components
import { Labelled } from 'forms/labelled/labelled';

// CSS
import { styles, vars, css } from 'styles/css';


export interface ShortInputProps {
  onChange(v: string|number): void
  label: string
  autofocus?: boolean
  errors?: string[]
  flex?: boolean
  inputRef?: (ref: HTMLInputElement) => void
  note?: string
  placeholder?: string
  required?: boolean
  type?: string
  value?: string|number
  autoComplete?: string
};

export class ShortInput extends React.Component<ShortInputProps, {}> {
  static contextTypes = {
    setActionContext: func,
    actionInContext: func
  }
  input: HTMLInputElement

  componentDidMount() {
    if (this.props.autofocus) this.focus();
  }

  focus() {
    this.input.focus();
  }

  onChange(value: string) {
    if (this.props.type === "number") {
      this.props.onChange(parseInt(value));
    } else {
      this.props.onChange(value);
    }
  }

  render() {
    const { label, note, type, errors, value, required, flex } = this.props
    return (
      <Labelled {...{ errors, label, note, required, flex }}>
        <input {...css(style.input, errors && style.errorInput) }
          className={dashify(this.props.label)} // For testing purposes
          ref={r => {
            this.input = r;
            if (this.props.inputRef) {
              this.props.inputRef(r);
            }
          }}
          autoComplete={this.props.autoComplete}
          placeholder={this.props.placeholder}
          aria-invalid={!!errors}
          aria-required={required}
          type={type}
          value={value}
          onChange={(e: any) => this.onChange(e.target.value)} />
        <div {...style.icon}>{this.props.children}</div>
      </Labelled>
    );
  }
}

let style = styles({

  errorInput: {
    borderColor: vars.color.warn
  },
  input: {
    width: '100%',
    display: 'block',
    backgroundColor: vars.color.whiteTransparent,
    color: vars.color.white,
    padding: vars.smallSpacing,
    marginTop: vars.smallSpacing / 2,
    marginBottom: vars.smallSpacing / 2,
    fontSize: vars.fontSize,
    ...vars.border,
    borderColor: 'transparent',
    boxShadow: 'none',
    ...vars.inputFocus,
    '::-webkit-input-placeholder': {
      color: 'rgba(255,255,255,0.25)',
    }
  },
  icon: {
    position: 'absolute',
    right: vars.smallSpacing,
    bottom: vars.smallSpacing - 2
  }
});
