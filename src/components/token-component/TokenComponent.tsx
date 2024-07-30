import { JPToken } from "@/util/token-type";
import styles from "./token.module.css"


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


export default function TokenComponent({ token, setSelected } : { token : JPToken, setSelected:  undefined|((a:JPToken)=>void) }) {


    return <span className={`${styles["jp-token"]} ${partOfSpeechToClass(token.type)}`}
            onClick={() => {
                if(setSelected) setSelected(token);
            }}
        >
        {token.token}
    </span>
}