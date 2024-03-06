import {Alert, Button, Form, Row,Col,Stack } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
   const {registerInfo, updateRegisterInfo,registerUser,registerError,isRegisterLoading}= useContext(AuthContext)
   // in line 18. ...registerInfo is used so that it only updates the particular field and not overwrite whole thing
    return <>
    <Form onSubmit={registerUser}>
        <Row style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%"
        }}>
            <Col xs="6">
            <Stack gap={3}>
                <h2> Register</h2>
                <Form.Control type="text" placeholder="Name" onChange={(e)=>updateRegisterInfo({...registerInfo, name:e.target.value})}/> 
                <Form.Control type="text" placeholder="Email" onChange={(e)=>updateRegisterInfo({...registerInfo, email:e.target.value})}/>
                <Form.Control type="text" placeholder="Password" onChange={(e)=>updateRegisterInfo({...registerInfo, password:e.target.value})}/>
                <Button variant="primary" type="submit">
                   {isRegisterLoading? "Creating account": "Register"}
                </Button>
                {
                    registerError?.error && <Alert variant="danger"><p>{registerError?.message}</p></Alert>
                }
                
            </Stack>
            </Col>
        </Row>
    </Form>
    
    </>;
}

export default Register;
