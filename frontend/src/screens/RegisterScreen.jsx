import { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loder from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";


const RegisterScreen = () => {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [register , { isLoading }] = useRegisterMutation();
    const { userInfo} = useSelector((state) => state.auth)

    useEffect(() => {
        if(userInfo){
            navigate('/')
        }
    },[navigate, userInfo])


    const sumbitHandler = async(e) => {
        e.preventDefault();
       
        if(password !== confirmPassword){
            toast.error('Password do not match')
        }else{
            try {
                const res = await register({name,email, password}).unwrap();
                dispatch(setCredentials({...res}))
                navigate('/')
            } catch (error) {
                toast.error(err?.data?.message || err.error)
            }
        }
        
    }

  return (
    <FormContainer>
        <h1>Sign Up</h1>

        <Form onSubmit={sumbitHandler}>
            <Form.Group className="my-2" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group className="my-2" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter Eamil" value={email} onChange={(e) => setEmail(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group className="my-2" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group className="my-2" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>

            {isLoading && <Loder/>}

            <Button type="submit"  variant="primary" className="mt-3" >Sign Up</Button>

            <Row className="py-3">
                <Col>
                    Already have an account?<Link to='/login'>Sign In</Link>
                </Col>
            </Row>
        </Form>
      
    </FormContainer>
  )
}

export default RegisterScreen
