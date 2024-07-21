  import Button from 'react-bootstrap/Button';
  import Col from 'react-bootstrap/Col';
  import Form from 'react-bootstrap/Form';
  import InputGroup from 'react-bootstrap/InputGroup';
  import Row from 'react-bootstrap/Row';
  import * as formik from 'formik';
  import * as yup from 'yup';
  import { v4 as uuidv4 } from 'uuid';
  import { useState } from 'react';
  import Table from 'react-bootstrap/Table';
  import './Form.css';
  import { useReducer } from 'react';


  function FormExample() {
    const { Formik } = formik;
    const [Formdata,setFormdata]=useState([])
    const [_, forceUpdate] = useReducer(x => x + 1, 0);
    const [Inival,setInival]=useState({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      state: '',
      DOB: ''
    })
    const [Editedvalue,setEditedvalue]= useState({})
    let duplicateCheck=true
    let countDupli=""

    // duplicate check for on submit value

    function Duplicate(value,editId){
        
          for(let duplicateval of Formdata){
            if(duplicateval.id!=editId){
            if(duplicateval.firstName==value.firstName&&duplicateval.lastName==value.lastName){
              duplicateCheck=false
              countDupli="firstName"
            }
            else if(duplicateval.phoneNumber==value.phoneNumber){
                duplicateCheck=false
                countDupli="phoneNumber"
            }
            else if(duplicateval.email==value.email){
              duplicateCheck=false
              countDupli="email"
            }
            }
          }
          return countDupli
    }

    //check for number validation

    function Phone(e){
      let invalidChars = ["-", "+", "e", "E"];
      if (invalidChars.includes(e.key)) {
          e.preventDefault();
      }
    }

    //calculating age

    function CalculateAge(e){

      
      /*  let currdate = new Date()
        let dobold = document.getElementById("DOB").value
        let dobnew = new Date(dobold)
        let age = currdate.getFullYear() - dobnew.getFullYear()
        if (currdate.getMonth() - dobnew.getMonth() < 0 || (currdate.getMonth() == dobnew.getMonth() && currdate.getDate() - dobnew.getDate() < 0)) {
            age--
        }
        if (age < 0) {
            document.getElementById("age").value = 0
        }
        else {
            document.getElementById("age").value = age
        } */
    }

    //schema for formik validation

    const schema = yup.object().shape({
      firstName: yup.string().max(15, 'Must be 15 characters or less'),
      lastName: yup.string().required(),
      email: yup.string().required(),
      phoneNumber: yup.string().required(),
      state: yup.string().required(),
      DOB: yup.string().required()
    });

      // form on submit

    function Formassign(value){

        if(Editedvalue.id!=undefined){ 
          Duplicate(value,Editedvalue.id)  

            if(duplicateCheck){ 
              setFormdata(Formdata.map((onevalue,ind)=>{
                console.log("onevalueid",onevalue.id)
                console.log("valueid",value.id)

                    if(onevalue.id==Editedvalue.id){
                      onevalue.firstName=value.firstName
                      onevalue.lastName=value.lastName
                      onevalue.email=value.email
                      onevalue.phoneNumber=value.phoneNumber
                      onevalue.state=value.state
                      onevalue.DOB=value.DOB
                      forceUpdate()
                    }
                    else{
                      return onevalue
                    }
                  }))
                  setFormdata(Formdata,value)
                  setEditedvalue({})
                  Inival.firstName=""
                  Inival.lastName=""
                  Inival.email=""  
                  Inival.phoneNumber=""
                  Inival.state=""
                  Inival.DOB="" 
                  forceUpdate() 
                  duplicateCheck=true
            }
            else{
              if(countDupli=="firstName"){
              Inival[countDupli]=""
              Inival.lastName=""
              alert(`duplicate first and last name found`)
              }
              else{
                Inival[countDupli]=""
                alert(`duplicate ${countDupli} found`)
              }
              duplicateCheck=true
            } 
        }
        else{
          Duplicate(value,value.id)
          if(duplicateCheck){
            let unique ={id:uuidv4()}
            let uniquevalue=value
            setFormdata([...Formdata,Object.assign(uniquevalue,unique)])
            //setFormdata([...Formdata,value])
            console.log(Formdata)
            duplicateCheck=true
          }
          else{
            duplicateCheck=true
            alert(`Duplicate ${countDupli} found`)
          }
        }
      // document.getElementById("age").value = ""
    }

    //Deleting a Form

    function Deleteformdata(index){
      setFormdata(Formdata.filter((value,ind)=>{
          return index!==ind
      }))
    }

    // Editing a Form
    
    function Editformdata(editval){
        Inival.firstName=editval.firstName
        Inival.lastName=editval.lastName
        Inival.email=editval.email  
        Inival.phoneNumber=editval.phoneNumber
        Inival.state=editval.state
        Inival.DOB=editval.DOB 
        
        forceUpdate()
      setEditedvalue(editval)
        
    }

    // returns itereted ROW 

    let FormRow=Formdata.map((Formvalue,index)=>{
      return(
      <tr key={Formvalue.id}>
          <td>{Formvalue.firstName}</td>
          <td>{Formvalue.lastName}</td>
          <td>{Formvalue.email}</td>
          <td>{Formvalue.phoneNumber}</td>
          <td>{Formvalue.state}</td>
          <td>{Formvalue.DOB}</td>
          <td><Button onClick={()=>{Deleteformdata(index)}} variant='danger'>DELETE</Button></td>
          <td><Button onClick={()=>Editformdata(Formvalue)} variant='warning'>EDIT</Button></td>
      </tr>
      )
  })


    return (
      <div>
        <h1>Student Information</h1>
      <Formik
        validationSchema={schema}
        onSubmit={(value, { resetForm })=>{Formassign(value,{resetForm});
          resetForm() }}
        initialValues={Inival}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form  onSubmit={handleSubmit}>
            <Row className="mb-3" id='Row'>
              <Form.Group as={Col} md="6" controlId="validationFormik01" className='Formvalue'>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  isValid={touched.firstName && !errors.firstName}
                />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationFormik02" className='Formvalue'>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  isValid={touched.lastName && !errors.lastName}
                />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationFormikUsername" className='Formvalue'>
                <Form.Label>Email</Form.Label>
                <InputGroup hasValidation>       
                  <Form.Control
                    type="email"
                    placeholder="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                  
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationFormik03" className='Formvalue'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  //id='Phone'
                  onKeyDown={Phone}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationFormik04" className='Formvalue'>
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="State"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationFormik05" className='Formvalue'>
                <Form.Label>Date of birth</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="DOB"
                  name="DOB"
                  //id='DOB'
                  value={values.DOB}
                  onChange={handleChange}
                  onSelect={CalculateAge}
                />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationFormik06" className='Formvalue'>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  name="age"
                  disabled
                  //id='age'
                  // value={values.age}
                  onChange={handleChange}
                />
              </Form.Group>
              
            </Row>
            <Button type="submit" id='subbtn'>Submit form</Button>
          </Form>
        )}
      </Formik>
      <Table striped="row" bordered hover variant='primary'>
          <thead>
              <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>State</th>
                  <th>Date of Birth</th>
                  <th>Delete</th>
                  <th>Edit</th>
              </tr>    
          </thead>
          <tbody key="tbody">
              {FormRow}
          </tbody> 
      </Table>
      </div>

    );
  }

  export default FormExample;