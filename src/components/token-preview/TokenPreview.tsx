import { JPToken } from "@/util/token-type"
import styles from "./token-preview.module.css"
import React, { useEffect, useMemo, useState } from "react";
import { Definition, useAllReadings, useDefinition, useKanjiKanaTokens, useReadings } from "../token-context/TokenContext";


// function useDefinition(term:string|null|undefined) {
//     const [ definition, setDefinition ] = useState<any|null>(null);
//     useEffect(() =>{ 
//         setDefinition(null);
//         if(term) {
//             fetch(`/api/term/jp/${encodeURIComponent(term)}`).then((res) => res.json()).then((definition) => {
//                 setDefinition(definition.result);
//                 // console.log(definition);
//             });
//         }
//     }, [term])

//     return definition;
// }

/*
Hiragana ( 3040 - 309f)
Katakana ( 30a0 - 30ff)
*/

function getKanjiKanaTokens(kanji:string) {

    const matches = Array.from(kanji.matchAll(/([\u4e00-\u9faf])([\u3040-\u309f]*)|([^\u4e00-\u9faf]+)/g));
 
    return matches.map((match) => {
        if(match[3]) {
            return {
                kanji: "",
                kana: match[3],
            };
        }
        if(match[2]) {
            return {
                kanji: match[1],
                kana: match[2],
            }
        }else {
            return {
                kanji: match[1],
                kana: ""
            };
        }
    });
}

function getKanji(kanji:string) {
    return Array.from(kanji.matchAll(/([\u4e00-\u9faf])/g)).map((match) => {
        return match[0];
    });
}

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

function DefinitionView({ definitions } : { definitions: any[]|undefined}) {
    if(definitions)
        return <ol>
            {definitions.map((def, i) => (<li key={i}>
                <p>
                    {def}
                </p>
            </li>))}
        </ol>
    else return <p>
        No definitions found.
    </p>
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
                                <span className={styles["preview"]}>
                                    <strong><FuriganaView token={token} definition={definition}/></strong>
                                </span>
                                {((token.type === "verb" && token.base !== token.token) ? 
                                    <span>({(token.base ?? "")})</span> : 
                                    <></>
                                )}
                                {/* <p>{definition.readings[0] ?? "No Reading Found."}</p> */}
                                <p><i>{token.type}</i></p>
                                <br/>
                                <DefinitionView definitions={definition.definitions}/>
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