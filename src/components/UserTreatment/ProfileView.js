import React, {useState} from "react";
import {Col, FormControl, Row, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {toast} from "react-toastify";

export function ProfileView(props) {
    const [mainHand, setMainHand] = useState(props.mainHand);
    const [nomenclature, setNomenclature] = useState(props.nomenclature);
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState(props.username);
    const [changedUsername, setChangedUsername] = useState("");
    const [email, setEmail] = useState("");
    const [changedEmail, setChangedEmail] = useState("");

    const radiosHanded = [{name: "Esquerrà", value: "LeftHanded"}, {name: "Dretà", value: "RightHanded"}];

    const radiosNomenclature = [{name: "Llatina", value: "Latin"}, {name: "Anglo-Saxona", value: "AngloSaxon"}];

    function handleUsernameChange(e) {
        setChangedUsername(e.target.value);
    }

    function handleEmailChange(e) {
        setChangedEmail(e.target.value);
    }

    function emailIsValid(email) {
        let re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    function handleOnSaveChangesClick(e) {
        props.onClick(username);

        let invalidUser = false,  user;

        if (username === changedUsername && email === changedEmail || changedUsername === "" && email === changedEmail ||
            username === changedUsername && changedEmail === "" || changedUsername === "" && changedEmail === "") {
            user = {
                mainHand: mainHand,
                nomenclature: nomenclature
            }

            fetch('/api/users')
                .then(res => res.json())
                .then(() => {
                    if (!invalidUser) {
                        fetch(`/api/users/${userId}`, {
                            method: 'PUT', body: JSON.stringify(user), headers: {
                                'Accept': 'application/json', 'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            if (res.ok) {
                                toast.success('Changes saved!', {
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
                        }).then(props.onClick(username, mainHand, nomenclature)).catch(err => console.error(err));
                        setMainHand(mainHand);
                        setNomenclature(nomenclature);
                    }
                }).catch(err => console.error(err));
        } else if (username !== changedUsername && email === changedEmail || username !== changedUsername && changedEmail === "") {
            user = {
                username: changedUsername,
                mainHand: mainHand,
                nomenclature: nomenclature
            }

            fetch('/api/users')
                .then(res => res.json())
                .then(savedUsers => {
                    savedUsers.forEach(savedUser => {
                        if (savedUser.username === changedUsername) {
                            toast.error('ERROR: Username already exists', {
                                position: "bottom-center",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            });
                            invalidUser = true;
                        }
                    });
                    if (!invalidUser) {
                        fetch(`/api/users/${userId}`, {
                            method: 'PUT', body: JSON.stringify(user), headers: {
                                'Accept': 'application/json', 'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            if (res.ok) {
                                toast.success('Changes saved!', {
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
                        }).then(props.onClick(username, mainHand, nomenclature)).catch(err => console.error(err));
                        setUsername(changedUsername);
                        setMainHand(mainHand);
                        setNomenclature(nomenclature);
                    }
                }).catch(err => console.error(err));
        } else if (username === changedUsername && email !== changedEmail || changedUsername === "" && email !== changedEmail) {
            user = {
                email: changedEmail,
                mainHand: mainHand,
                nomenclature: nomenclature
            }

            fetch('/api/users')
                .then(res => res.json())
                .then(savedUsers => {
                    savedUsers.forEach(savedUser => {
                        if (!emailIsValid(changedEmail)) {
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
                            invalidUser = true;
                        }
                        if (savedUser.email === changedEmail) {
                            toast.error('ERROR: Email already exists', {
                                position: "bottom-center",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            });
                            invalidUser = true;
                        }
                    });
                    if (!invalidUser) {
                        fetch(`/api/users/${userId}`, {
                            method: 'PUT', body: JSON.stringify(user), headers: {
                                'Accept': 'application/json', 'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            if (res.ok) {
                                toast.success('Changes saved!', {
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
                        }).then(props.onClick(username, mainHand, nomenclature)).catch(err => console.error(err));
                        setEmail(changedEmail);
                        setMainHand(mainHand);
                        setNomenclature(nomenclature);
                    }
                }).catch(err => console.error(err));
        } else {
            e.preventDefault();
            user = {
                username: changedUsername,
                email: changedEmail,
                mainHand: mainHand,
                nomenclature: nomenclature
            }

            fetch('/api/users')
                .then(res => res.json())
                .then(savedUsers => {
                    savedUsers.forEach(savedUser => {
                        if (savedUser.username === changedUsername) {
                            toast.error('ERROR: Username already exists', {
                                position: "bottom-center",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            });
                            invalidUser = true;
                        }
                        if (!emailIsValid(changedEmail)) {
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
                            invalidUser = true;
                        }
                        if (savedUser.email === changedEmail) {
                            toast.error('ERROR: Email already exists', {
                                position: "bottom-center",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            });
                            invalidUser = true;
                        }
                    });
                    if (!invalidUser) {
                        fetch(`/api/users/${userId}`, {
                            method: 'PUT', body: JSON.stringify(user), headers: {
                                'Accept': 'application/json', 'Content-Type': 'application/json'
                            }
                        }).then(res => {
                            if (res.ok) {
                                toast.success('Changes saved!', {
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
                        }).then(props.onClick(username, mainHand, nomenclature)).catch(err => console.error(err));
                        setUsername(changedUsername);
                        setEmail(changedEmail);
                        setMainHand(mainHand);
                        setNomenclature(nomenclature);
                    }
                }).catch(err => console.error(err));
        }
    }

    function handleHandedChange(e) {
        setMainHand(e.target.value);
    }

    function handleNomenclatureChange(e) {
        setNomenclature(e.target.value);
    }

    function getUserData() {
        fetch('/api/users')
            .then(res => res.json())
            .then(savedUsers => {
                savedUsers.forEach(savedUser => {
                    if (savedUser.username == username) {
                        setUserId(savedUser._id);
                        setEmail(savedUser.email);
                    }
                });
            }).catch(err => console.error(err));
    }

    function buildHandedToggleButtonGroup() {
        if (mainHand === "LeftHanded"){
            return <ToggleButtonGroup className={"w-100"} name={"handedButtons"} defaultValue={"LeftHanded"}>
                {radiosHanded.map((radioHanded, idx) => (<ToggleButton
                    className={"w-50"}
                    key={"rH" + idx}
                    id={`radioHanded-${idx}`}
                    type="radio"
                    variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                    name="radio"
                    value={radioHanded.value}
                    checked={mainHand === radioHanded.value}
                    onChange={handleHandedChange}>
                    {radioHanded.name}
                </ToggleButton>))}
            </ToggleButtonGroup>;
        } else if (mainHand === "RightHanded") {
            return <ToggleButtonGroup className={"w-100"} name={"handedButtons"} defaultValue={"RightHanded"}>
                {radiosHanded.map((radioHanded, idx) => (<ToggleButton
                    className={"w-50"}
                    key={"rH" + idx}
                    id={`radioHanded-${idx}`}
                    type="radio"
                    variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                    name="radio"
                    value={radioHanded.value}
                    checked={mainHand === radioHanded.value}
                    onChange={handleHandedChange}>
                    {radioHanded.name}
                </ToggleButton>))}
            </ToggleButtonGroup>;
        }
    }

    function buildNomenclatureToggleButtonGroup() {
        if (nomenclature == "Latin") {
            return <ToggleButtonGroup className={"w-100"} name={"nomenclatureButtons"} defaultValue={"Latin"}>
                {radiosNomenclature.map((radioNomenclature, idx) => (<ToggleButton
                    className={"w-50"}
                    key={"n" + idx}
                    id={`radioNomenclature-${idx}`}
                    type="radio"
                    variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                    name="radio"
                    value={radioNomenclature.value}
                    checked={nomenclature === radioNomenclature.value}
                    onChange={handleNomenclatureChange}>
                    {radioNomenclature.name}
                </ToggleButton>))}
            </ToggleButtonGroup>;
        } else if (nomenclature == "AngloSaxon") {
            return <ToggleButtonGroup className={"w-100"} name={"nomenclatureButtons"} defaultValue={"AngloSaxon"}>
                {radiosNomenclature.map((radioNomenclature, idx) => (<ToggleButton
                    className={"w-50"}
                    key={"n" + idx}
                    id={`radioNomenclature-${idx}`}
                    type="radio"
                    variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                    name="radio"
                    value={radioNomenclature.value}
                    checked={nomenclature === radioNomenclature.value}
                    onChange={handleNomenclatureChange}>
                    {radioNomenclature.name}
                </ToggleButton>))}
            </ToggleButtonGroup>;
        }
    }

    getUserData();

    return <>
        <Container className={"align-items-center"}>
            <Row className={"mt-xl-5"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <h1>PERFIL D'USUARI</h1>
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
                    <FormControl name={"username"} type={"text"} placeholder={username.toString()}
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
                    <FormControl name={"username"} type={"text"} placeholder={email.toString()}
                                 onChange={handleEmailChange}/>
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-4"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <h5>Others:</h5>
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-2"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    {buildHandedToggleButtonGroup()}
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-3"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    {buildNomenclatureToggleButtonGroup()}
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-5"}>
                <Col/>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <Button className={"btn w-100 btn-dark"} onClick={handleOnSaveChangesClick}>Guarda els
                        Canvis</Button>
                </Col>
                <Col/>
            </Row>
        </Container>
    </>
}