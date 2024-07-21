import React, { useState } from 'react'
import "./Formnew.css"
import Table from 'react-bootstrap/Table';
import { useRef } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from 'antd';
import SchoolTwoToneIcon from '@mui/icons-material/SchoolTwoTone';
import States from './states.json'

function Formnew() {
    const[Tabledata,setTabledata]=useState([])
    const[Editindex,setEditindex]=useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [indianDistrict,setindianDistrict] =useState([])
    const formRef = useRef(null);


    //Validation for UNIQUE application number

    function Uniqueapp(e) {
         for (let appno of Tabledata) {
         if (appno.application.includes(e.target.value)) {
            alert("Try another application number");
            e.target.value = "";
            return false;
        }
      } 
    }

    //validation for phone number
   
    function Phonevalid (e) {
        let invalidChars = ["-", "+", "e", "E"];
        if (invalidChars.includes(e.key)) {
        e.preventDefault();
    }
        if(e.target.value.length>=10 && e.key!='Backspace'){
            e.preventDefault();
        }
}
    //CALCULATING AGE

     function CalculateAge(e) {
        let currdate = new Date()
        let dobold = e.target.value
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
        }
    }

    //ON SUBMITTING FORM

    function Formsubmit(e){
        e.preventDefault();

        let Data = new FormData(formRef.current)
        let currentData=Object.fromEntries(Data)

        const DuplicateName = Tabledata.some((item, index) => {
            return item.firstName === currentData.firstName && item.lastName === currentData.lastName && index !== Editindex;
        });
        if (DuplicateName) {
            alert('Duplicate entry for first name and last name.');
            return;
        }
        const DuplicatePhone = Tabledata.some((item,index)=>{
            return item.phoneNumber === currentData.phoneNumber && index !==Editindex
        })
        if (DuplicatePhone){
            alert('Duplicate entry for phone Number found');
            return
        }

        if(Editindex!==null){
            let updatedData = [...Tabledata];
            updatedData[Editindex] = currentData;
            setTabledata(updatedData);
            setEditindex(null);
        }
        else{
        //Object.assign(currentData,{id1:uuidv4()})
        setTabledata([...Tabledata,currentData])
    }
        formRef.current.reset()
        setIsModalOpen(false);
        
    }

    //DELETING ROW

    function Deleterow(index){
        setTabledata(Tabledata.filter((value,ind)=>{
            return index!==ind
        }))
    }

    //EDITING ROW

    function Editrow(index){
        setIsModalOpen(true);
        
        let Editform = Tabledata[index]
        let EditformKeys = Object.keys(Editform)
    for (let elename of EditformKeys) {
        let eleID = document.getElementsByName(elename)[0].id
        document.getElementById(eleID).value = Editform[elename]
    }
    setEditindex(index);
    }

    let Row =Tabledata.map((value,index)=>{
        return(
            <tr key={index}>
                <td>{value.application}</td>
                <td>{value.firstName}</td>
                <td>{value.lastName}</td>
                <td>{value.email}</td>
                <td>{value.phoneNumber}</td>
                <td>{value.age}</td>    
                <td>{value.gender}</td> 
                <td>{value.course}</td>
                <td>{value.state},{value.district}</td>
                <td><Button onClick={()=>{Editrow(index)}} variant='outline-warning'>Edit</Button></td>
                <td><Button onClick={()=>{Deleterow(index)}} variant='outline-danger'>Delete</Button></td>
            </tr>
        )
    })
        
    // MAPPING STATE VALUE

     let indianState= States.states.map((state,index)=>{
        return(
            <option key={index} value={state.state}>{state.state}</option>
        )
    })
    
    function selectDistrict(e){
        let State1=e.target.value
        let Selectedstate=States.states.find((value)=>{return value.state==State1})
        
        setindianDistrict(Selectedstate.districts.map((dis,ind)=>{
            return(
                <option key={ind} value={dis}>{dis}</option>
            )
        }))
    }
 
    // To OPEN AND CLOSE MODAL

    const showModal = () => {
        if(formRef.current){
            formRef.current.reset()
        }
        setIsModalOpen(true);
  
      };

    const handleCancel = () => {
        setIsModalOpen(false);
        //setEditindex(null)
      };

    const Resetform=()=>{
        formRef.current.reset()
    }
  


  return (
    <div>
        
        <Modal  open={isModalOpen} width={'60%'}  onCancel={handleCancel} footer={null} mask={true} maskClosable={false}>
        <h3>STUDENT DETAIL</h3>
        <form ref={formRef} className="stu-reg id" id='formdata' onSubmit={Formsubmit}>
        <div className="form-group">
                <label htmlFor="application">Application Number<span>*</span></label>
                <input type="text" className="form-control" name='application' id="application"  placeholder="Application Number" onChange={Uniqueapp} maxLength="3" readOnly={Editindex!=null} required></input>
            </div>
            <div className="form-group">
                <label htmlFor="firstName">First Name<span>*</span></label>
                <input type="text" className="form-control" name='firstName' id="firstName"  placeholder="Enter your firstname" required></input>
            </div>
            <div className="form-group">
                <label htmlFor="lastName">Last Name<span>*</span></label>
                <input type="text" className="form-control" name='lastName'  id="lastName" placeholder="Enter your lastName" required></input>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email id</label>
                <input type="email" className="form-control" name='email' id="email" placeholder="email"></input>
            </div>
            <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number<span>*</span></label>
                <input type="number" className="form-control" id="phoneNumber" name='phoneNumber' placeholder="phoneNumber"  onKeyDown={Phonevalid}required></input>
            </div>
            <div className="form-group2">
            <div className="form-group1">
                <label htmlFor="date">Date</label>
                <input type="date" className="form-control" id="date" name='date' onChange={CalculateAge}></input>
            </div>
            <div className="form-group3">
                <label htmlFor="date">Age</label>
                <input type="number" className="form-control" id="age" name='age' readOnly></input>
            </div>
            </div>
            <div className='form-group'>
            <div className="form-check">
                <p>Gender</p>
                <input className="form-check-input" type="radio" name="gender" id="flexRadioDefault1" value='Male' required></input>
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                    Male
                </label>
                </div>
                <div className="form-check">
                <input className="form-check-input" type="radio" name="gender" id="flexRadioDefault2" value='Female'></input>
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Female
                </label>
            </div>
            </div>
            <div className='form-group'>
                <label htmlFor="course">Select course:</label>
                <select name="course" id="course">
                    <option value="Biology">Biology</option>
                    <option value="Computer science">Computer science</option>
                    <option value="Arts">Arts</option>
                </select>         
            </div>
            <div>
            <label htmlFor="state">Select state:</label>
                <select name="state" id="state" onChange={selectDistrict}>
                   {indianState}             
                </select>  
            </div>
            <div>
            <label htmlFor="district">Select district:</label>
                <select name="district" id="district">
                    <option>Select State</option>
                   {indianDistrict}
                </select>  
            </div>
            <div className="form-group">
                 <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" required></input>
                  <label className="form-check-label" htmlFor="defaultCheck1">
                        Agreed to terms and condition of the school
                 </label>
                </div> 
                <div className='btn-form'>        
            <Button type="submit" className="btn Submit" variant="success">Submit</Button>
            <Button onClick={Resetform} className="btn1" id='btnreset' variant="warning" disabled={Editindex!=null}>Reset</Button>
            </div>
    
        </form>
       
        </Modal>
        <h2>STUDENT INFORMATION </h2>
        <Button variant="outline-dark" onClick={()=>showModal()} className='mod-btn'>NEW REGISTRATION<SchoolTwoToneIcon className='school'/></Button>
        <Table striped bordered hover  className='tab w-75'>
            <thead>
                <tr>
                <th>Application Number</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email Id</th>
                <th>Phone Number</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Course</th>
                <th>Address</th>
                <th>Edit</th>
                <th>Delete</th>
                </tr>
            </thead>
      <tbody>   
        
        {Row}  
      </tbody>
    </Table>
   
     </div>
  )
}

export default Formnew