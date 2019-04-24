import React, { Component } from 'react'
import {connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import {deleteEducation  } from '../../actions/profileActions' ;


 class Education extends Component {

   onDeleteClickEdu(id)  {
        console.log(id);
        this.props.deleteEducation(id);
    }
  render() {
      const education = this.props.education.map( edu => (
            <tr key = {edu._id}>
                <td >{edu.school}</td>
                <td >{edu.degree}</td>
                <Moment format  = "YYYY/MM/DD">{edu.from}</Moment>--
                {edu.to === null ? ('Now') : (<Moment format  = "YYYY/MM/DD">{edu.from}</Moment>  )}            
                <td ><button className="btn btn-danger" onClick ={this.onDeleteClickEdu.bind(this,edu._id)}>Delete</button></td>
            </tr>

      ));
    return (
      <div style = {{fontSize : "20px"}}>
            <h4 className="mb-4"> Education Credentials</h4>
            <table className="table">
            <tr>
                <th>SChool</th>
                <th>Degree</th>
                <th>Years</th>
                <th></th>
            </tr>

            

                {education}
      
            </table>
      </div>
    )
  }
}

Education.propTypes = {
    deleteEducation:PropTypes.func.isRequired
}

export default connect(null, {deleteEducation}) (Education) ;
