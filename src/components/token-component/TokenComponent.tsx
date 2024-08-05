import { JPToken } from "@/util/token-type";
import styles from "./token.module.css"
import { useDefinition } from "../token-context/TokenContext";
import { FuriganaView } from "../token-preview/TokenPreview";


function partOfSpeechToClass(pos:string) {
    const map = {
        "adverb": "jp-token-adverb",
        "noun": "jp-token-adverb",
        "particle": "jp-token-adverb",
        "verb": "jp-token-adverb",
        "auxillary-verb": "jp-token-adverb",
        "pronoun": "jp-token-pronoun",
        "adjective": "jp-token-adjective"
        // "pronoun": "jp-token-pronoun"
    };
    if(pos in map) return styles[pos];
    else return styles["unknown"];
}


export default function TokenComponent({ token, setSelected, seperate  } : { token : JPToken, setSelected:  undefined|((a:JPToken)=>void), seperate?: boolean }) {
    const definitions = useDefinition(token);


    return <span className={`${styles["jp-token"]} ${partOfSpeechToClass(token.type)} ${(seperate ? styles["seperate"] : "")}`}
            onClick={setSelected}
        >
        <FuriganaView token={token} definition={(definitions ? definitions[0] : null)}/>
    </span>
}