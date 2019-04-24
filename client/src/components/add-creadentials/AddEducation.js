import React, { Component } from 'react';
import {Link  , withRouter } from 'react-router-dom';
import TextFieldGroup  from '../common/TextFieldGroup'; 
import {connect} from 'react-redux' ; 
import {addEducation}  from '../../actions/profileActions';

import  TextAreaFieldGroup, {TextareaFieldGroup} from '../common/TextAreaFieldGroup' ; 
import {PropTypes} from 'prop-types';


class AddEducation extends Component {

    constructor(props)  {
            super(props);
            this.state  = {
                    school : '' , 
                    degree : '',
                    fieldofstudy :'', 
                    from  : '' , 
                    to :'' ,
                    current : false , 
                    description : '' , 
                    errors : {} , 
                    disabled:false
            }
    };

    onChange =(e) => {
        this.setState({
            [e.target.name] : e.target.value  
         })
    }
    componentWillReceiveProps (nextProps) {
        if(nextProps.errors) {
            this.setState({errors: nextProps.errors});
        }
    }

    onSubmit = (e) => {
        e.preventDefault();

        const eduData = {
                school : this.state.school ,
                degree : this.state.degree , 
                fieldofstudy : this.state.fieldofstudy , 
                from : this.state.from , 
                to :this.state.to , 
                current : this.state.current , 
                description : this.state.description 

        };
        this.props.addEducation(eduData , this.props.history) ;
        console.log("errs");
        console.log(this.state.errors);


        console.log("submit");
    }
    onCheck = (e) => {
        this.setState({
            disabled:!this.state.disabled , 
            current : !this.state.current
        })
    }

    
  render() {

      const {errors}  = this.state ; 

    return (
      <div>
            <div className="add-experience">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                        <Link to="/dashboard"  className="btn btn-light">
                            Go Back
                        </Link>
                        <h1 className="display-4 text-center">
                            Add Education
                        </h1>
                        <p className="lead text-center"></p>
                        <small className="d-block-pb-3">* = required fields</small>
                        <form onSubmit= {this.onSubmit} >
                        <TextFieldGroup 
                  placeholder = "* School" 
                  name = "school" 
                  value = {this.state.school}
                  onChange = {this.onChange}
                  error = {errors.school}
              />
               <TextFieldGroup 
                  placeholder = "* Degree or Certification" 
                  name = "degree" 
                  value = {this.state.degree}
                  onChange = {this.onChange}
                  error = {errors.handle}
              />
                <TextFieldGroup 
                  placeholder = "* Field of Study" 
                  name = "fieldofstudy" 
                  value = {this.state.fieldofstudy}
                  onChange = {this.onChange}
                  error = {errors.fieldofstudy}
              />
                <h6>
                  From date
              </h6>
               <TextFieldGroup 
                  placeholder = "From " 
                  name = "from" 
                  value = {this.state.from}
                  onChange = {this.onChange}
                  error = {errors.from}
                  type = "date"
              />


              <h6>
                  To Data
              </h6>
              <TextFieldGroup 
                  placeholder = "to " 
                  type = "date"
                  name = "to" 
                  value = {this.state.to}
                  onChange = {this.onChange}
                  error = {errors.to}
                  disabled = {this.state.disabled ? 'disabled' : ''}
              />

              <div className="form-check mb-">
                <input type="checkbox"
                className = "form-chack-input"
                name = "current"
                value = {this.state.current} 
                checked = {this.state.current}
                onChange = {this.onCheck}
                id = "current"
                
                />
                <label htmlFor="current" className="form-chack-label">
                Current school
                </label>
              </div>

              <TextAreaFieldGroup
                  placeholder = "Program description " 
                  name = "description" 
                  value = {this.state.desctiption}
                  onChange = {this.onChange}
                  error = {errors.desctiption}
                    info = "Tell us about the  program that you are in"
            />
            <input type="submit" value="Submit" className="btn btn-info btn-block mt-4"/>



              
                   
                        
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        
      </div>
    )
  }
}

AddEducation.propTypes  = {
    addEducation : PropTypes.func.isRequired,
    profile : PropTypes.object.isRequired , 
    errors : PropTypes.object.isRequired
}
const mapStateToProps  = state => ({
    profile: state.profile , 
    errors : state.errors 
})
export default connect(mapStateToProps ,  {addEducation})(withRouter(AddEducation));
