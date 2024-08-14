import { toHiragana } from "wanakana";

export type Sense = {
    pos: string[],
    definitions: string[],
    misc: string[]
};

export type Definition = {
    readings: string[],
    kanjis: string[],
    senses: Sense[]
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

export function getKanjiKanaTokens(kanji:string) {

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

export function getCharacters(kanji:string) {
    return Array.from(kanji.matchAll(/([\u4e00-\u9faf])/g)).map((match) => {
        return match[0];
    });
}

export function shiftColumn(initial:string, final:string) {
    const initialMap : { [x: string] : string }= {
        "か":"k",
        "き":"k",
        "く":"k",
        "け":"k",
        "こ":"k",

        "が":"g",
        "ぎ":"g",
        "ぐ":"g",
        "げ":"g",
        "ご":"g",

        "さ":"s",
        "し":"s",
        "す":"s",
        "せ":"s",
        "そ":"s",

        "ざ":"z",
        "じ":"z",
        "ず":"z",
        "ぜ":"z",
        "ぞ":"z",

        "た":"t",
        "ち":"t",
        "つ":"t",
        "て":"t",
        "と":"t",

        "だ":"d",
        "ぢ":"d",
        "づ":"d",
        "で":"d",
        "ど":"d",

        "な":"n",
        "に":"n",
        "ぬ":"n",
        "ね":"n",
        "の":"n",

        "ま":"m",
        "み":"m",
        "む":"m",
        "め":"m",
        "も":"m",

        "は":"h",
        "ひ":"h",
        "ふ":"h",
        "へ":"h",
        "ほ":"h",

        "ば":"b",
        "び":"b",
        "ぶ":"b",
        "べ":"b",
        "ぼ":"b",

        "ぱ":"p",
        "ぴ":"p",
        "ぷ":"p",
        "ぺ":"p",
        "ぽ":"p",

        "わ":"w",
        "を":"w",
    };

    initial = (initial in initialMap ? initialMap[initial] : initial);

    const columnMap : { [x: string] : { [x: string] : string } }= {
        "k": {
            "a": "か",
            "i": "き",
            "u": "く",
            "e": "け",
            "o": "こ"
        },
        "g": {
            "a": "が",
            "i": "ぎ",
            "u": "ぐ",
            "e": "げ",
            "o": "ご"
        },
        "s": {
            "a": "さ",
            "i": "し",
            "u": "す",
            "e": "せ",
            "o": "そ"
        },
        "z": {
            "a": "ざ",
            "i": "じ",
            "u": "ず",
            "e": "ぜ",
            "o": "ぞ"
        },
        "t": {
            "a": "た",
            "i": "ち",
            "u": "つ",
            "e": "て",
            "o": "と"
        },
        "d": {
            "a": "だ",
            "i": "ぢ",
            "u": "づ",
            "e": "で",
            "o": "ど"
        },
        "n": {
            "a": "な",
            "i": "に",
            "u": "ぬ",
            "e": "ね",
            "o": "の"
        },
        "r": {
            "a": "ら",
            "i": "り",
            "u": "る",
            "e": "れ",
            "o": "ろ"
        },
        "m": {
            "a": "ま",
            "i": "み",
            "u": "む",
            "e": "め",
            "o": "も"
        },
        "h": {
            "a": "は",
            "i": "ひ",
            "u": "ふ",
            "e": "へ",
            "o": "ほ"
        },
        "b": {
            "a": "ば",
            "i": "び",
            "u": "ぶ",
            "e": "べ",
            "o": "ぼ"
        },
        "w": {
            "a": "わ",
            "i": "い",
            "u": "う",
            "e": "え",
            "o": "お"
        },
    }

    return columnMap[initial][final];
}




export function rendaku(reading:string) {
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

export function getReadings(phrase:string, characters:CharacterInfoMap) {
    const tokens = getKanjiKanaTokens(phrase);
    const charactersInPhrase = getCharacters(phrase);

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
    let possible: {reading: string, rendaku: boolean, characterReadings: { [x:string] : string} }[] = [{reading:"", characterReadings:{}, rendaku: false}]
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

    return possible;
}