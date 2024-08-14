"use client"

import { ChangeEvent, useState } from "react"
import styles from "./page.module.css"
import { shiftColumn } from "@/util/furigana";




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








export function ConjugationSelector({ term, type } : { term: string, type: string }) {
    const [ settings, setSettings ] = useState({
        causative: false,
        polite: false,
        negative: false,
        te: false,
        past: false
    });

    let currentType = type;
    let result = "";
    let bases = getVerbForms(term, currentType);
    result = bases?.shu ?? "";
    if(settings.negative) {
        const base = (bases?.miz ?? "");
        result = base + "ない";
        bases = {
            base,
            miz: base + "なかろ",
            ren: base + "なか",
            shu: base + "",
            rent: base + "",
            kat: base + "",
            mei: base + "",
            vol: base + "う",
            onbin: {
                te: base + "",
                ta: base + ""
            }
        }
    }

    if(settings.te) {
        result = bases?.onbin.te ?? "";
    }

    return <form>
        <h3>{result}</h3>
        <table>
            <tbody>
                <tr>
                    <td>
                        <label htmlFor="causative">Causative</label>
                    </td>
                    <td>
                        <input name="causative" type="checkbox" 
                            checked={settings.causative}
                            onChange={(e) => 
                                setSettings((old) => 
                                    ({...old, causative:e.target.checked})
                            )}
                            />
                    </td>
                </tr>
                {/* <tr>
                    <td>
                        <label htmlFor="passive">Passive</label>
                    </td>
                    <td>
                        <input name="passive" type="checkbox"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor="desired">Desired</label>
                    </td>
                    <td>
                        <input name="desired" type="checkbox"/>
                    </td>
                </tr> */}
                <tr>
                    <td>
                        <label htmlFor="polite">Polite</label>
                    </td>
                    <td>
                        <input name="polite" type="checkbox"
                            checked={settings.polite}
                            onChange={(e) => 
                                setSettings((old) => 
                                    ({...old, polite:e.target.checked})
                            )}
                            />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor="negative">Negative</label>
                    </td>
                    <td>
                        <input name="negative" type="checkbox"
                            checked={settings.negative}
                            onChange={(e) => 
                                setSettings((old) => 
                                    ({...old, negative:e.target.checked})
                            )}
                            />
                    </td>
                </tr>
                {/* <tr>
                    <td>
                        <label htmlFor="evidential">Evidential</label>
                    </td>
                    <td>
                        <input name="evidential" type="checkbox"/>
                    </td>
                </tr> */}
                <tr>
                    <td>
                        <label htmlFor="conjuctive">Te-Conjuctive</label>
                    </td>
                    <td>
                        <input name="conjunctive" type="checkbox"
                            checked={settings.te}
                            onChange={(e) => 
                                setSettings((old) => 
                                    ({...old, te:e.target.checked})
                            )}
                            />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor="evidential">Past</label>
                    </td>
                    <td>
                        <input name="evidential" type="checkbox"
                            checked={settings.past}
                            onChange={(e) => 
                                setSettings((old) => 
                                    ({...old, past:e.target.checked})
                            )}
                            />
                    </td>
                </tr>
                {/* <tr>
                    <td>
                        <label htmlFor="evidential">Evidential</label>
                    </td>
                    <td>
                        <input name="evidential" type="checkbox"/>
                    </td>
                </tr> */}
            </tbody>
        </table>
    </form>
}