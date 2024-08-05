import { JPToken } from "@/util/token-type";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toHiragana, toKana } from "wanakana";

export type Definition = {
    readings: string[],
    token: string,
    definitions: string[],
};

export type DefinitionMap = {
    [key:string]: Definition[],
};

export type CharacterInfo = {
    character: string,
    readings: { type: string, reading: string }[],
    definitions: string[],
};

export type CharacterInfoMap = {
    [key:string]: CharacterInfo|null,
};

export type TokenContextType = {

    characters: CharacterInfoMap,
    setCharacters: React.Dispatch<React.SetStateAction<CharacterInfoMap>>,

    definitions: DefinitionMap,
    setDefinitions: React.Dispatch<React.SetStateAction<DefinitionMap>>
};

const _TokenContext = createContext<TokenContextType>({
    definitions: {},
    setDefinitions: ()=>{},
    characters: {},
    setCharacters: ()=>{},
});


// export function useDefinitions() {
//     const { definitions } = useContext(_TokenContext);
//     return definitions;
// }

export function useDefinition(token:JPToken|null) {


    const base = (token?.type==="verb" ? token.base ?? token.token : token?.token);
    const { definitions, setDefinitions } = useContext(_TokenContext);
    const definition = (base ? definitions[base] : null);
    useEffect(() => {
        if(definition == null && base) {
            fetch(`/api/term/jp/${encodeURIComponent(base)}`)
                .then((res) => res.json())
                .then(({ result } : {result: Definition[]}) => {
                    setDefinitions((old) => {
                        const out = {
                            ...old
                        };
                        out[base] = result;
                        return out;
                    });
                    // definition
                });
        }
    }, [definition, base, setDefinitions]);

    return definition;
}




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

function getCharacters(kanji:string) {
    return Array.from(kanji.matchAll(/([\u4e00-\u9faf])/g)).map((match) => {
        return match[0];
    });
}




export function useKanjiKanaTokens(phrase:string|null) {
    
    return useMemo(() => {
        return getKanjiKanaTokens(phrase ?? "");
    }, [phrase]);
}


function rendaku(reading:string) {
    const rendakuMap : { [x: string] : string } = {
        "か":"が",
        "き":"ぎ",
        "く":"ぐ",
        "け":"げ",
        "こ":"ご",
        
        "さ":"ざ",
        "し":"じ",
        "す":"ず",
        "せ":"ぜ",
        "そ":"ぞ",
        
        "た":"だ",
        "ち":"じ",
        "つ":"ず",
        "て":"で",
        "と":"ど",
        
        "は":"ば",
        "ひ":"び",
        "ふ":"ぶ",
        "へ":"べ",
        "ほ":"ぼ",
    }
    if(reading.length === 0) return null;
    if(reading[0] in rendakuMap)
        return rendakuMap[reading[0]] + reading.slice(1);
    return null;
}

export function useReadings(phrase:string|null) {
    const { characters, setCharacters } = useContext(_TokenContext);

    const charactersInPhrase = useMemo(() => getCharacters(phrase ?? ""), [phrase]);


    useEffect(() => {
        // const out : CharacterInfoMap = {};
        charactersInPhrase.forEach((character) => {
            if(!(character in characters)) {
                setCharacters((old) => {
                    const out = {
                        ...old
                    };
                    out[character] = null;
                    return out;
                });
                fetch(`/api/kanji/jp/${encodeURIComponent(character)}`)
                    .then((res) => res.json())
                    .then(({ result } : {result: CharacterInfo | null }) => {
                        if(result) {
                            setCharacters((old) => {
                                const out = {
                                    ...old
                                };
                                out[character] = result;
                                return out;
                            });
                        }
                    });
            }else {
                // out[character] = characters[character];
            }
        });

    }, [characters, charactersInPhrase, setCharacters]);

    const tokens = useMemo(() => {
        return getKanjiKanaTokens(phrase ?? "");
    }, [phrase]);

    const possibleReadings = useMemo(() => {
        if(charactersInPhrase.length === 0) return [];
        const characterReadings : {[x:string]:{ type: string, reading: string }[]|null} = {};
        
        tokens.forEach((token, i) => {
            if(token.kanji.length !== 0) {
                const character = characters[token.kanji];
                if(character) {
                    characterReadings[token.kanji] = character.readings.filter((reading) => {
                        if(reading.type !== "ja_on" && reading.type !== "ja_kun") return false;
                        
                        const a = reading.reading.split(".");
                        const isSuffix = reading.reading.startsWith("-");
                        const isPrefix = reading.reading.endsWith("-");
                        const isAffix = isSuffix && isPrefix;

                        if(isAffix) {
                            return 0 < i && i < tokens.length;
                        }else if(isSuffix) {
                            return i == tokens.length-1;
                        }else if(isPrefix) {
                            return i == 0;
                        }
                        if(a.length === 1 && token.kana === "") return true;
                        if(a.length === 2 && token.kana === a[1]) return true;
                        return false;
                    }).map((reading) => {
                        if(reading.type === "ja_on") {
                            return {...reading, reading: toHiragana(reading.reading)};
                        }else {
                            return {...reading, reading: reading.reading.replaceAll("-","").split(".")[0]}
                        }

                    });
                }else {
                    characterReadings[token.kanji] = [];
                }
            }else {

            }
        });

        // console.log(characterReadings);

        // tokens.forEach((token))
        let possible: {reading: string, rendaku: boolean, characterReadings: { [x:string] : string} }[] = [{reading:"", characterReadings:{}}]
        for(let i = 0; i < tokens.length; i ++) {
            if(tokens[i].kanji !== "") {
                let newPossible: {reading: string, rendaku: boolean, characterReadings: { [x:string] : string} }[] = [];
                possible.forEach((possiblilty) => {
                    characterReadings[tokens[i].kanji]?.forEach((reading) => {
                        const a : { [x:string] : string}  = {
                            ...possiblilty.characterReadings
                        };
                        a[tokens[i].kanji] = reading.reading;
                        newPossible.push({
                            reading: possiblilty.reading + reading.reading + tokens[i].kana,
                            characterReadings: a,
                            rendaku: false,
                        });
                        const rendakued = rendaku(reading.reading);
                        if(rendakued) {
                            const a : { [x:string] : string}  = {
                                ...possiblilty.characterReadings
                            };
                            a[tokens[i].kanji] = rendakued;
                            newPossible.push({
                                reading: possiblilty.reading + rendakued + tokens[i].kana,
                                characterReadings: a,
                                rendaku: true,
                            });
                        }
                    });
                });
                possible = newPossible;
            }else if(tokens[i].kana !== "") {
                possible.forEach((possiblilty) => {
                    possiblilty.reading += tokens[i].kana;
                });
            }
        }
        // console.log(characters[tokens[1].kanji]);
        // console.log(characters);
        // console.log(possible);
        return possible;

    }, [charactersInPhrase, characters, tokens]);

    // const possible

    // if(character)
        // return characters[character];
    return { readings: possibleReadings, tokens };
}
// export function useAllReadings(characterList:string[]|null) {
//     const { characters, setCharacters } = useContext(_TokenContext);

//     useEffect(() => {
//         if(characterList != null) {
//             characterList.forEach((character) => {
//                 if(!(character in characters)) {
//                     fetch(`/api/kanji/jp/${encodeURIComponent(character)}`)
//                     .then((res) => res.json())
//                     .then(({ result } : {result: CharacterInfo | null }) => {
//                         if(result) {
//                             setCharacters((old) => {
//                                 const out = {
//                                     ...old
//                                 };
//                                 out[character] = result;
//                                 return out;
//                             });
//                         }
//                         // definition
//                     });
//                 }
//             });
//         }
//     }, [characters, characterList, setCharacters]);

//     if(characterList) {
//         let out : CharacterInfoMap = {};
//         characterList.forEach((character) => {out[character] = characters[character]});
//         return out;
//     }
//     return {};
// }


export function TokenContext({ children } : { children : React.ReactNode}) {

    const [ definitions, setDefinitions ] = useState<DefinitionMap>({});
    const [ characters, setCharacters ] = useState<CharacterInfoMap>({});

    return <_TokenContext.Provider value={{
        definitions,
        setDefinitions,

        characters,
        setCharacters
    }}>{children}</_TokenContext.Provider>
}