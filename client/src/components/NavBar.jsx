import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {Notifications} from "../components/chat/Notifications"
const NavBar = () => {

    const {user, logoutUser} = useContext(AuthContext);
    //this is for chat name top center
    return (
        <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
            <Container>
                <h2>
                    <Link to="/" className="Link-light text-decoration-none">ChatApp</Link>

                </h2>
           { user &&  (<span className="text-warning">Logged in as {user?.name}</span>)}
            <Nav>

                <Stack direction="horizontal" gap={3}>

                    {
                        user && (<>
                        <Notifications/>
                         <Link onClick={()=>logoutUser()} to="/logout" className="Link-light text-decoration-none">
                        Logout
                        </Link>
                        </>)
                    }
                    {
                        !user && (<>
                         <Link to="/login" className="Link-light text-decoration-none">
                            Login
                        </Link>
                        <Link to="/register" className="Link-light text-decoration-none">
                            Register
                        </Link>
                        </>)
                    }
                   
                </Stack>
            </Nav>
            </Container>
        </Navbar>);
    //this is for login register top right options: Nav 
    //stack will align items to vertical direction by default in nav so set direction as horizontal
}

export default NavBar;