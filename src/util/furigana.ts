import { toHiragana } from "wanakana";

export type Sense = {
    pos: string[],
    definitions: string[],
    misc: string[]
};

export type Definition = {
    readings: string[],
    token: string,
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