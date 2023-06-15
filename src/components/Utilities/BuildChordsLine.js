import React from "react";
import Button from "react-bootstrap/Button";

export function buildChordsLine(currentLine, lineChords, nomenclature) {
    let chordsLine = [], prevLineSlot = 0, spaces;

    if (lineChords.length != 0) {
        lineChords.forEach(lineChord => {
            spaces = parseInt(lineChord.lineSlot) - prevLineSlot;
            while (spaces > 0) {
                chordsLine.push(<Button className={"btn grid nopadding"}
                                        disabled={true}>X</Button>);
                spaces--;
            }
            if (nomenclature == "AngloSaxon") {
                if (lineChord.chord.length == 1) {
                    chordsLine.push(<Button
                        className={"btn btn-dark chordAssigned nopadding"}>{lineChord.chord}</Button>);
                } else {
                    chordsLine.push(<Button
                        className={"btn btn-dark chordAssigned nopadding"}>{lineChord.chord[0]}<span
                        className={"chordComplement"}>{lineChord.chord.substring(1)}</span></Button>);
                }
            } else {
                if (lineChord.chord.length == 2 || (lineChord.chord.includes("SOL") && lineChord.chord.length == 3)) {
                    chordsLine.push(<Button
                        className={"btn btn-dark chordAssigned nopadding"}>{lineChord.chord}</Button>);
                } else if (lineChord.chord.includes("SOL")) {
                    chordsLine.push(<Button
                        className={"btn btn-dark chordAssigned nopadding"}>{lineChord.chord[0] + lineChord.chord[1] + lineChord.chord[2]}<span
                        className={"chordComplement"}>{lineChord.chord.substring(3)}</span></Button>);
                } else {
                    chordsLine.push(<Button
                        className={"btn btn-dark chordAssigned nopadding"}>{lineChord.chord[0] + lineChord.chord[1]}<span
                        className={"chordComplement"}>{lineChord.chord.substring(2)}</span></Button>);
                }
            }
            prevLineSlot = parseInt(lineChord.lineSlot) + 1;
        });
    }

    spaces = 22 - prevLineSlot
    while (spaces > 0) {
        chordsLine.push(<Button className={"btn grid nopadding"} disabled={true}>X</Button>);
        spaces--;
    }

    return chordsLine;
}