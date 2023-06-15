import React, {useState} from "react";
import {Col, FormControl, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";

export function LogInView(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function resetForm() {
        setUsername("");
        setPassword("");
    }

    function handleOnLogInClick(e) {
        let validCredentials = false;
        e.preventDefault();

        fetch('/api/users')
            .then(res => res.json())
            .then(savedUsers => {
                savedUsers.forEach(savedUser => {
                    if (savedUser.username == username && savedUser.password == password) {
                        validCredentials = true;
                        props.onClick(username, savedUser.mainHand, savedUser.nomenclature);
                        toast.success('Login success!', {
                            position: "bottom-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                        navigate("../");
                    }
                });
                if (!validCredentials) {
                    toast.error('ERROR: Invalid credentials', {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                }
            }).catch(err => console.error(err));
        resetForm();
    }

    return <>
        <Container className={"align-items-center"}>
            <Row className={"mt-xl-5"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <h1>INICIAR SESSIÓ</h1>
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-5"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <h5>Nom d'usuari:</h5>
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-2"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <FormControl name={"username"} type={"text"} placeholder={"Nom d'usuari"} value={username}
                                 onChange={handleUsernameChange}/>
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-4"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <h5>Contrasenya:</h5>
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-2"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <FormControl name={"password"} type={"password"} placeholder={"Contrasenya"} value={password}
                                 onChange={handlePasswordChange}/>
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-5"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <Button className={"btn w-100 btn-dark"} onClick={handleOnLogInClick}>Iniciar Sessió</Button>
                </Col>
                <Col/>
            </Row>
        </Container>
    </>
}