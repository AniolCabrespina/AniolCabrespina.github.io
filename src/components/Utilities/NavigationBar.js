import React, {useState} from "react";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {CreateTranscriptView} from "../CreateTranscript/CreateTranscriptView";
import {LogInView} from "../UserTreatment/LogInView";
import {RegisterView} from "../UserTreatment/RegisterView";
import {ProfileView} from "../UserTreatment/ProfileView";
import {HomeView} from "../TranscriptSearchDisplay/HomeView";
import {DisplayTranscriptView} from "../TranscriptSearchDisplay/DisplayTranscriptView";
import {CollectionView} from "../UserTreatment/CollectionView";
import {EditTranscriptView} from "../EditTranscript/EditTranscriptView";


export function NavigationBar() {
    const [userLogged, setUserLogged] = useState("");
    const [userMainHand, setUserMainHand] = useState("");
    const [userNomenclature, setUserNomenclature] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [fetchSwitcher, setFetchSwitcher] = useState(true);

    let availableViews, navigate = useNavigate();

    function displayAvailableViews() {
        if (userLogged != "") {
            availableViews = (<>
                <Nav.Link as={Link} to={"/profile"}>Perfil</Nav.Link>
                <Nav.Link as={Link} to={"/collection"}>Col·lecció</Nav.Link>
                <Nav.Link as={Link} to={"/createTranscript"}>Crear Transcripció</Nav.Link>
            </>);
        } else {
            availableViews = (<>
                <Nav.Link as={Link} to={"/register"}>Registrar-se</Nav.Link>
                <Nav.Link as={Link} to={"/logIn"}>Iniciar Sessió</Nav.Link>
            </>);
        }
    }

    function getUserLogged(userLogged, userMainHand, userNomenclature) {
        setUserLogged(userLogged);
        setUserMainHand(userMainHand);
        setUserNomenclature(userNomenclature);
    }

    function displaySongClicked(singer, title, owningUsers) {
        navigate("/viewTranscript", {state: {singer: singer, title: title, owningUsers: owningUsers}});
    }

    function editTranscriptClicked(transcriptId) {
        navigate("/editTranscript", {state: {transcriptId: transcriptId}});
    }

    function goHome() {
        navigate("/");
        handleSearchFetch();
    }

    function handleSearchChange(e) {
        setSearchInput(e.target.value);
    }

    function handleSearchFetch() {
        setFetchSwitcher(prevState => !prevState);
    }

    displayAvailableViews();

    return <>
        <Navbar bg="dark" variant={"dark"} expand="lg">
            <Container fluid>
                <Navbar.Brand as={Link} to={"/"}>TFG App de Xifrats i Tabulatures</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{maxHeight: '100px'}}
                        navbarScroll
                    >
                        {availableViews}
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            onChange={handleSearchChange}
                        />
                        <Nav.Link as={Link} to={"/"}>
                            <Button className={"btn-secondary"} onClick={handleSearchFetch}>Cerca</Button>
                        </Nav.Link>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>

        <Routes>
            <Route path={"/"} element={<HomeView searchInput={searchInput} fetchSwitcher={fetchSwitcher}
                                                 onClick={displaySongClicked}/>}/>
            <Route path="/profile"
                   element={<ProfileView username={userLogged} mainHand={userMainHand} nomenclature={userNomenclature}
                                         onClick={getUserLogged}/>}/>
            <Route path="/logIn" element={<LogInView onClick={getUserLogged}/>}/>
            <Route path="/register" element={<RegisterView onClick={getUserLogged}/>}/>
            <Route path="/createTranscript" element={<CreateTranscriptView username={userLogged} mainHand={userMainHand}
                                                                           nomenclature={userNomenclature}
                                                                           onClick={goHome}/>}/>
            <Route path={"/viewTranscript"}
                   element={<DisplayTranscriptView username={userLogged} mainHand={userMainHand}
                                                   nomenclature={userNomenclature} onClick={editTranscriptClicked}/>}/>
            <Route path={"/collection"}
                   element={<CollectionView username={userLogged} onClick={displaySongClicked}/>}/>
            <Route path={"/editTranscript"}
                   element={<EditTranscriptView username={userLogged} mainHand={userMainHand}
                                                nomenclature={userNomenclature} onClick={goHome}/>}/>
        </Routes>
    </>
}