
// import { useRouter } from 'next/router'

import { CharacterInfo, CharacterInfoMap, Definition, getCharacters, getKanjiKanaTokens, getReadings } from "@/util/furigana";
import { usePathname } from "next/navigation"
import React from "react";
import { toHiragana } from "wanakana";
import styles from "./page.module.css"
import { PartOfSpeech } from "@/util/token-type";




async function getAllKanji(characters:string[]) {
    const characterInfo : CharacterInfoMap = {};
    await Promise.all(
        characters.map(async (character) => {
            const a = await fetch(`http://localhost:8000/kanji/jp/${encodeURIComponent(character)}`)
                .then(res => res.json())
                .then((res) => res.result) as CharacterInfo
            characterInfo[character] = a;
        }));
    return characterInfo;
}


export default async function SearchResult({ params } : { params: { term: string } }) {
    // const router = useRouter()
    // const term = decodeURIComponent(params.term);

    const definitions = await fetch(`http://localhost:8001/term/jp/${params.term}`).then(res => res.json()).then(res => res.result) as Definition[];


    if(definitions) {
        // const tokens = getKanjiKanaTokens(term);
        // const characters = getCharacters(term);

        // const characterInfo = await getAllKanji(characters);
    
        // const readings = getReadings(term, characterInfo);
        return <ul className={styles["definition-list"]}>
            {definitions.map((definition, i) => {
                return <Definition key={i} term={definition.kanjis[0]} definition={definition}/>
            })}
        </ul>
    }
    
    return <p>{decodeURIComponent(params.term)} was not found</p>
}




async function Definition({ term, definition } : { term: string, definition: Definition}) {
    const tokens = getKanjiKanaTokens(term);
    const characters = getCharacters(term);

    const characterInfo = await getAllKanji(characters);
    
    const readings = getReadings(term, characterInfo);
    const reading = readings.find((reading) => definition.readings.some((_reading) => _reading.startsWith(reading.reading)));
    if(reading) {
        return <li>
            <span className={styles["term-display"]}>
                <FuriganaView tokens={tokens} readings={reading.characterReadings}/>
            </span>
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
        </li>
    }else {
        const a : { [a:string] : string } = {};
        a[term] = definition.readings[0];
        return <li>
            <span className={styles["term-display"]}>
                <FuriganaView tokens={[{kanji: term, kana:""}]} readings={a}/>
            </span>
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
        </li>
    }
}



function FuriganaView({ tokens, readings } : { tokens: { kanji: string, kana: string }[], readings : { [a:string] : string }}) {
    return <ruby>
        {tokens.map((a, i) => (<React.Fragment key={i}>
            {a.kanji !== "" ? 
            <>{a.kanji}<rt>{readings[a.kanji]}</rt>{a.kana}<rt></rt></>:
            <>{a.kana}<rt></rt></>
            }
        </React.Fragment>))}
        </ruby>
}