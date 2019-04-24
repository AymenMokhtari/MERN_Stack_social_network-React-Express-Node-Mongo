import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const InputGroup = ({
  name,
  placeholder,
  value,
  error,
  type,
  onChange, 
  icon ,
  info
}) => {
  return (
    <div className="input-group mb-3">
    <div className="input-group-prepend">
            <span className="input-group-text">
            <i  i className= {icon}/>
            </span>
    </div>
      <textarea
      
        className={classnames('form-control form-control-lg', {
          'is-invalid': error
        })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}

      />
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

InputGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  icon : PropTypes.string,
 
};
InputGroup.defaultProps = {

    type:"text"
} 
export default InputGroup;
