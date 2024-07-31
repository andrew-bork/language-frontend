import { JPToken } from "@/util/token-type"
import styles from "./token-preview.module.css"
import React, { useEffect, useMemo, useState } from "react";
import { useDefinition } from "../token-context/TokenContext";


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

const kanjiRegex = /([\u4e00-\u9faf]+)|([^\u4e00-\u9faf]+)/g;

function getKanjiReading(kanji:string, reading:string) {

    const matches = Array.from(kanji.matchAll(kanjiRegex));
    let furiganaRegex = "";
    let lastIsKana = false;
    matches.forEach((match) => {
        if(match[1]) {
            furiganaRegex += "(.+)";
            lastIsKana = false;
        }else {
            furiganaRegex += `(${match[2]})`;
            lastIsKana = true;
        }
    });
    // kanji.replaceAll(kanjiRegex, "(.+)");
    const regex = new RegExp(furiganaRegex);
    const matches2 = reading.match(regex);

    let out : any = {};

    if(matches2){
        for(let i = 1; i < matches2.length; i ++) {
            if(matches[i-1][1])
                out[matches[i-1][1]] = matches2[i];
                
        }
        // console.log(matches2, matches);
    }
    return out;
}

function getKanji(kanji:string) {
    const matches = Array.from(kanji.matchAll(kanjiRegex));
    return matches.map((match) => {
        const out = {
            isKanji: false,
            kanji: "",
            kana: ""
        }
        if(match[1]) {
            out.isKanji = true;
            out.kanji = match[1];
        }
        else {
            out.kana = match[2];
        }
        return out;
    });
}

export function FuriganaView({ text, reading, base } : { text:string, reading:string|null|undefined, base:string|null|undefined }) {
    
    const kanji = useMemo(() => {
        return getKanji(text);
    }, [text]);
    
    const furigana = useMemo(() => {
        let k = base ?? text;
        if(reading)
            return getKanjiReading(k, reading);
        return null;
    }, [text, reading, base]);


    if(furigana) {
        return <ruby>
            {kanji.map((a, i) => (<React.Fragment key={i}>
                {a.isKanji ? 
                <>{a.kanji}<rt>{furigana[a.kanji]}</rt></> :
                <>{a.kana}<rt></rt></>
                }
            </React.Fragment>))}
        </ruby>
    }else {
        return <>{text}</>
    }
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
                                    <strong><FuriganaView text={token.token} reading={definition.readings[0]} base={token.base}/></strong>
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