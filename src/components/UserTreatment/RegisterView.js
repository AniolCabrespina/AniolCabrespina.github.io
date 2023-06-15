import React, {useState} from "react";
import {Col, FormControl, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export function RegisterView(props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstPass, setFirstPassword] = useState("");
    const [secondPass, setSecondPassword] = useState("");
    const navigate = useNavigate();

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handleFirstPasswordChange(e) {
        setFirstPassword(e.target.value);
    }

    function handleSecondPasswordChange(e) {
        setSecondPassword(e.target.value);
    }

    function emailIsValid(email) {
        let re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    function resetForm() {
        setUsername("");
        setEmail("");
        setFirstPassword("");
        setSecondPassword("");
    }

    function handleOnRegisterClick(e) {
        let repeatedUser = false, validEmail, user;

        validEmail = emailIsValid(email);

        if (firstPass == secondPass && validEmail && username != "") {
            e.preventDefault();

            user = {
                userId: '',
                username: username,
                email: email,
                password: firstPass,
                mainHand: 'RightHanded',
                nomenclature: 'AngloSaxon'
            }

            fetch('/api/users')
                .then(res => res.json())
                .then(savedUsers => {
                    savedUsers.forEach(savedUser => {
                        if (savedUser.username == user.username) {
                            toast.error('ERROR: User already registered with this username', {
                                position: "bottom-center",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            });
                            repeatedUser = true;
                        }
                        if (savedUser.email == user.email) {
                            toast.error('ERROR: User already registered with this email', {
                                position: "bottom-center",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            });
                            repeatedUser = true;
                        }
                    });
                    if (!repeatedUser) {
                        navigate("../");
                        fetch('/api/users', {
                            method: 'POST', body: JSON.stringify(user), headers: {
                                'Accept': 'application/json', 'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            if (res.ok) {
                                toast.success('Register success!', {
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
                        }).then(props.onClick(username, user.mainHand, user.nomenclature)).catch(err => console.error(err));

                    }
                }).catch(err => console.error(err));
        } else {
            if (!validEmail) {
                toast.error('ERROR: Wrong email format', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (username == ""){
                toast.error('ERROR: Invalid username', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                toast.error("ERROR: Passwords don't match", {
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
        }
        resetForm();
    }

    return <>
        <Container className={"align-items-center"}>
            <Row className={"mt-xl-5"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <h1>REGISTRAR-SE</h1>
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
                    <h5>Correu electrònic:</h5>
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-2"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <FormControl name={"username"} type={"email"} placeholder={"email@gmail.com"} value={email}
                                 onChange={handleEmailChange}/>
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
                    <FormControl name={"firstPassword"} type={"password"} placeholder={"Contrasenya"} value={firstPass}
                                 onChange={handleFirstPasswordChange}/>
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-2"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <FormControl name={"secondPassword"} type={"password"} placeholder={"Repeteix la teva contrasenya"}
                                 value={secondPass}
                                 onChange={handleSecondPasswordChange}/>
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-5"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <Button className={"btn w-100 btn-dark"} type={"submit"}
                            onClick={handleOnRegisterClick}>Registrar-se</Button>
                </Col>
                <Col/>
            </Row>
        </Container>
    </>
}