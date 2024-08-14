
// import { useRouter } from 'next/router'

import { CharacterInfo, CharacterInfoMap, Definition, getCharacters, getKanjiKanaTokens, getReadings, shiftColumn } from "@/util/furigana";
import { usePathname } from "next/navigation"
import React from "react";
import { toHiragana } from "wanakana";
import styles from "./page.module.css"
import { PartOfSpeech } from "@/util/token-type";
import { ConjugationSelector } from "./conjugator";




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
                return <DefinitionView key={i} term={definition.kanjis[0] ?? definition.readings[0]} definition={definition}/>
            })}
        </ul>
    }
    
    return <p>{decodeURIComponent(params.term)} was not found</p>
}


function getOnBin(base: string, type: string) { 
    console.log("onbin", type)
    if(type === "v5k") {
        return {
                ta: base+"いた",
                te: base+"いて",
            };
    }
    if(type === "v5g") {
        return {
                ta: base+"いだ",
                te: base+"いで",
            };
    }if(type === "v5s") {
        return {
                ta: base+"した",
                te: base+"して",
            };
    }if(type === "v5t") {
        return {
                ta: base+"った",
                te: base+"って",
            };
    }if(type === "v5n") {
        return {
                ta: base+"んだ",
                te: base+"んで",
            };
    }if(type === "v5b") {
        return {
                ta: base+"んだ",
                te: base+"んで",
            };
    }if(type === "v5m") {
        return {
                ta: base+"んだ",
                te: base+"んで",
            };
    }if(type === "v5r" || type === "v5r-i") {
        return {
                ta: base+"った",
                te: base+"って",
            };
    }if(type === "v5w") {
        return {
                ta: base+"った",
                te: base+"って",
            };
    }
    if(type === "v5u-s") {
        return {
            ta: base+"うた",
            te: base+"うて",
        }
    }
    if(type === "v5k-s") {
        return {
            ta: base+"った",
            te: base+"って",
        };
    }
    return {
        ta: base+"った",
        te: base+"って",
    };
}


function getVerbForms(term:string, type:string) {
    if(type.startsWith("v5")) {
        const base = term.substring(0, term.length-1);
        let inflect = type[2];
        if(inflect === "u") inflect = "w";
        console.log(inflect);
        const result = {
            base,
            miz: base + shiftColumn(inflect, "a"),
            ren: base + shiftColumn(inflect, "i"),
            shu: base + shiftColumn(inflect, "u"),
            rent: base + shiftColumn(inflect, "u"),
            kat: base + shiftColumn(inflect, "e"),
            mei: base + shiftColumn(inflect, "e"),
            vol: base + shiftColumn(inflect, "o") + "う",
            onbin: getOnBin(base, type)
        };

        if(type === "v5r-i") {
            result.mei = base + "い";
        }

        return result;
    }else if(type.startsWith("v1")) {
        const base = term.substring(0, term.length-1);

        const result = {
            base,
            miz: base,
            ren: base,
            shu: base + "る",
            rent: base + "る",
            kat: base + "れ",
            mei: base + "ろう",
            vol: base + "よう",
            onbin: { te: base + "て", ta: base + "た"}
        };

        return result;
    }

    return null;
}

// async function VerbInfo({ term, string }) 

async function FormTable({ forms } : { forms: { base: string, miz: string, ren: string, shu: string, rent: string, kat: string, mei: string, vol: string, onbin: {ta: string, te: string}}}) {
    return <table>
        <tbody>
            <tr>
                <th>Base</th>
                <td>{forms.base}</td>
            </tr>
            <tr>
                <th>Mizenkei</th>
                <td>{forms.miz}</td>
            </tr>
            <tr>
                <th>Ren&apos;yōkei</th>
                <td>{forms.ren}</td>
            </tr>
            <tr>
                <th>Shūshikei</th>
                <td>{forms.shu}</td>
            </tr>
            <tr>
                <th>Rentaikei</th>
                <td>{forms.rent}</td>
            </tr>
            <tr>
                <th>Kateikei</th>
                <td>{forms.kat}</td>
            </tr>
            <tr>
                <th>Meireikei</th>
                <td>{forms.mei}</td>
            </tr>
            <tr>
                <th>Volitional</th>
                <td>{forms.vol}</td>
            </tr>
            <tr>
                <th>Onbin</th>
                <td>{forms.onbin.ta}</td>
                <td>{forms.onbin.te}</td>
            </tr>
        </tbody>
    </table>
}

function sliceends(s:string) {
    return s.slice(1, s.length-1);
}


async function DefinitionView({ term, definition } : { term: string, definition: Definition}) {
    const tokens = getKanjiKanaTokens(term);
    const characters = getCharacters(term);

    const characterInfo = await getAllKanji(characters);
    
    const readings = getReadings(term, characterInfo);


    const reading = readings.find((reading) => definition.readings.some((_reading) => _reading.startsWith(reading.reading)));

    const sense = definition.senses[0];
    console.log(sense.pos.find((a) => (a[1] === "v")));
    const forms = getVerbForms(term, sense.pos.find((a) => (a[1] === "v"))?.substring(1) ?? "");
    console.log(forms);
    if(reading) {
        return <li>
            <span className={styles["term-display"]}>
                <FuriganaView tokens={tokens} readings={reading.characterReadings}/>
            </span>
                <ol>
                    {(forms ? <FormTable forms={forms}/> : <></>)}
                    <ConjugationSelector term={term} type={sliceends(sense.pos.find((a) => (a[1] === "v")) ?? "")}/>
                    
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
                    {(forms ? <FormTable forms={forms}/> : <></>)}
                    <ConjugationSelector term={term} type={sliceends(sense.pos.find((a) => (a[1] === "v")) ?? "")}/>

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