import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup' ; 
import TextAreaFieldGroup from '../common/TextAreaFieldGroup' ; 
import InputGroup from '../common/InputGroup' ; 
import SelectListGroup from '../common/SelectListGroup' ; 
import {withRouter} from 'react-router-dom'
import CreateProfile from '../create-profile/CreateProfile'
import {createProfile , getCurrentProfile} from '../../actions/profileActions';
import isEmpty from '../../validation/isEmpty';
import {Link} from  'react-router-dom';
class EditProfile extends Component {

    constructor(props) {
        super(props) ; 
        this.state = {
            displaySocialInput  : false , 
            handle : '' , 
            company  : '',
            website  : '',
            location  : '',
            status : '',
            skills : '',
            githubusername  : '',
            bio  : '',
            twitter  : '',
            facebook  : '',
            linkedin : '',
            youtube : '',
            instagram  : '',
            errors   : {},




        }
        


    }
    onChange = (e) => {
      this.setState({
       
          [e.target.name] : e.target.value  
      })
      }




    onSubmit = (e) => {
      e.preventDefault() ;


    const profileData = {

      handle : this.state.handle , 
      company  : this.state.company,
      website  : this.state.website,
      location  : this.state.location,
      status : this.state.status,
      skills : this.state.skills,
      githubusername  : this.state.githubusername,
      bio  : this.state.bio,
      twitter  : this.state.twitter,
      facebook  : this.state.facebook,
      linkedin : this.state.linkedin,
      youtube : this.state.youtube,
      instagram  : this.state.instagram

    }
    this.props.createProfile(profileData,this.props.history);
  }

  componentDidMount(){
      this.props.getCurrentProfile();
  }
componentWillReceiveProps(nextProps) {
  if(nextProps.errors) {
    this.setState({errors: nextProps.errors})
  }

  if(nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      //bring skills array back to csv 
      const skillsCSV =  profile.skills.join(',');

      // if profile field doesnt exist , make empty 
      profile.company = !isEmpty(profile.company) ? profile.company : '';
      profile.website = !isEmpty(profile.website) ? profile.website : '';
      profile.location = !isEmpty(profile.location) ? profile.location : '';
      profile.githubusername = !isEmpty(profile.githubusername) ? profile.githubusername : '';
      profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
    //set component fields state
    this.setState({
        handle : profile.handle , 
        company  : profile.company,
        website  : profile.website,
        location  : profile.location,
        status : profile.status,
        skills : skillsCSV,
        githubusername  : profile.githubusername,
        bio  : profile.bio
     

    })      

  }
}


  render() {
    const {errors} = this.state ;

    // Setect option for status 

    const options = [
      {label : 'Select Professional Status *' , value : '0'},
      {label : 'Developer' , value : 'Developer'},
      {label : 'junior Developer' , value : 'junior Developer'},
      {label : 'Senior Developer' , value : 'Senior Developer'},
      {label : 'Manager' , value : 'Manager'},
      {label : 'Student' , value : 'DeveloStudentper'},
      {label : 'Instructor ' , value : 'Instructor'},
      {label : 'Other' , value : 'Other'},
    ]
    return (

    
        <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
            <Link to="/dashboard"  className="btn btn-light">
                            Go Back
                        </Link>
              <h1 className="display-4 text-center">Edit Profile</h1>



              <small className="d-block pb-3">* = required field</small>
              <form onSubmit = {this.onSubmit}>

                <TextFieldGroup 
                  placeholder = "* Profile Handle" 
                  name = "handle" 
                  value = {this.state.handle}
                  onChange = {this.onChange}
                  error = {errors.handle}
                  info = "A unique handle for your profile URL. Your full name, company name"
              />
              <SelectListGroup 
                  placeholder = "Status"
                  name = "status" 
                  value = {this.state.status}
                  onChange = {this.onChange}
                  options = {options}
                  error = {errors.status}
                  info = "Give up and idea of where you are at in your career"
              />
              <TextFieldGroup 
                  placeholder = "Company" 
                  name = "company" 
                  value = {this.state.company}
                  onChange = {this.onChange}
                  error = {errors.company}
                  info = "Could be your company or one you work for"
              />

              <TextFieldGroup 
                  placeholder = "Website" 
                  name = "website" 
                  value = {this.state.website}
                  onChange = {this.onChange}
                  error = {errors.website}
                  info = "Could be your website or you company one"
              />

            <TextFieldGroup 
                  placeholder = "Location" 
                  name = "location" 
                  value = {this.state.location}
                  onChange = {this.onChange}
                  error = {errors.location}
                  info = "(eg . Boston , MA))"
              />

            <TextFieldGroup 
                  placeholder = "Skills" 
                  name = "skills" 
                  value = {this.state.skills}
                  onChange = {this.onChange}
                  error = {errors.skills}
                  info = "Please use comma seperated values (eg. HTML , CSS )"
              />
              <TextFieldGroup 
                  placeholder = "Git Hub Username" 
                  name = "githubusername" 
                  value = {this.state.githubusername}
                  onChange = {this.onChange}
                  error = {errors.githubusername}
                  info = "your github link"
              />


              <TextAreaFieldGroup
                             placeholder = "Short Bio" 
                             name = "bio" 
                             value = {this.state.bio}
                             onChange = {this.onChange}
                             error = {errors.bio}
                             info = "Tell us a little about yourself"
                 />

                <input 
                type = "submit"
                value = "Submit"
                className="btn btn-info btn-block mt-4"/>

    
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

EditProfile.propTypes = {
    profile : PropTypes.object.isRequired , 
    errors : PropTypes.object.isRequired , 
    createProfile : PropTypes.func.isRequired,
    getCurrentProfile : PropTypes.func.isRequired

}
const mapStateTopProps  = state => ({
    profile : state.profile , 
    errors : state.errors
})

CreateProfile.propTypes =  {
    profile : PropTypes.object.isRequired,
    errors : PropTypes.object.isRequired
  }

export default  connect(mapStateTopProps , {createProfile,getCurrentProfile}) (withRouter(EditProfile));