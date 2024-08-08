import { JPToken, PartOfSpeech } from "@/util/token-type"
import styles from "./token-preview.module.css"
import React, { useEffect, useMemo, useState } from "react";
import { Definition, useDefinition, useKanjiKanaTokens, useReadings } from "../token-context/TokenContext";



export function FuriganaView({ token, definition } : { token:JPToken, definition:Definition|null }) {
    
    const tokens = useKanjiKanaTokens(token.token);
    const { readings } = useReadings(token.base ?? token.token);
    if(0 < readings.length) {
        if(definition) {
            // console.log(token);
            const reading = readings.find((reading) => definition.readings.some((_reading) => _reading.startsWith(reading.reading)));
            if(reading) {
                return <ruby>
                    {tokens.map((a, i) => (<React.Fragment key={i}>
                        {a.kanji !== "" ? 
                        <>{a.kanji}<rt>{reading.characterReadings[a.kanji]}</rt>{a.kana}<rt></rt></>:
                        <>{a.kana}<rt></rt></>
                        }
                    </React.Fragment>))}
                </ruby>
            }else {
                return <ruby>
                    {token.token}<rt>{definition.readings[0]}</rt>
                </ruby>
            }
        }else {
            const reading = readings[0];
            return <ruby>
                {tokens.map((a, i) => (<React.Fragment key={i}>
                    {a.kanji !== "" ? 
                    <>{a.kanji}<rt>{reading.characterReadings[a.kanji]}</rt>{a.kana}<rt></rt></>:
                    <>{a.kana}<rt></rt></>
                    }
                </React.Fragment>))}
            </ruby>
        }

    }
    // console.log(possibleReadings);

    // if(furigana) {
    //     return <>
    //         {kanji.map((a, i) => (<React.Fragment key={i}>
    //             {a.isKanji ? 
    //             <>{a.kanji}<rt>{furigana[a.kanji]}</rt></> :
    //             <>{a.kana}<rt></rt></>
    //             }
    //         </React.Fragment>))}
    //     </>
    // }else {
    // if (kanji.length === 0) {
    //     console.log(readings)
    //     return <>{token.token}</>
    // }
    return <>{token.token}</>
    // }
}

function DefinitionView({ token, definition } : { token: JPToken, definition : Definition}) {
    return <>
        <span className={styles["preview"]}>
        <strong><FuriganaView token={token} definition={definition}/></strong>
        </span>
        {/* {((token.type === "verb" && token.base !== token.token) ? 
            <span>({(token.base ?? "")})</span> : 
            <></>
        )} */}
        <br/>
        <ol>
            {definition.senses.map((sense, i) => (<React.Fragment  key={i}>
                <p className={styles["pos"]}>{sense.pos.map((pos)=>PartOfSpeech.getDisplayString(pos.slice(1,pos.length-1))).join(", ")}</p>
                <li className={styles["sense"]}>
                    <p>
                        {sense.definitions.map((definition) => definition).join("; ")}
                    </p>
                </li>
            </React.Fragment>
            ))}
        </ol>
    </>
}









export default function TokenPreview({ token } : { token: null|JPToken}) {
    const definitions = useDefinition(token);
    // console.log(generateFurigana("立ち向かう", "たちむかう"));
    if(token && definitions)
        return <div className={styles["container"]}>
            <ul className={styles["readings-list"]}>
                {
                    definitions.map((definition, i) => {
                        return <React.Fragment key={i}>
                            {(i > 0 ? <hr/> : <></>)}
                            <li>
                                <DefinitionView token={token} definition={definition}/>
                            </li>
                        </React.Fragment>
                    })
                }
            </ul>
        </div>
    else if(token) {
        return <div className={styles["container"]}>
            <span className={styles["preview"]}>
                <strong>{token.token}</strong>
            </span>
            {((token.type === "verb" && token.base !== token.token) ? 
                <span>({(token.base ?? "")})</span> : 
                <></>
            )}
            <p><i>{token.type}</i></p>
            <p>No definitions found.</p>
        </div>
    }
    else
        return <div></div>
} 