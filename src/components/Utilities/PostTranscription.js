import React from "react";
import Button from "react-bootstrap/Button";

export function PostTranscription() {
    return <>
        <Button variant={"primary"}
                style={{margin: '4px'}}>Xifrat
        </Button>
        <Button variant={"primary"}
                style={{margin: '4px'}}>Tabulatura
        </Button>
    </>
}