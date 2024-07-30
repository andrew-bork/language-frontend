import { JPToken } from "@/util/token-type"
import styles from "./token-preview.module.css"

export default function TokenPreview({ token } : { token: null|JPToken}) {
    if(token)
        return <div>
            <span className={styles["preview"]}><strong>{token.token}</strong></span>
            <p>{token.type}</p>
        </div>
    else
        return <div></div>
} 