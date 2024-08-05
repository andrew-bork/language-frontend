"use client"

import Image from "next/image";
import styles from "./page.module.css";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

import jpTokenStyles from "./jp-token.module.css"
import TokenComponent from "@/components/token-component/TokenComponent";
import TokenPreview from "@/components/token-preview/TokenPreview";
import { TokenContext } from "@/components/token-context/TokenContext";

const text = `愛にできる事をまだあるかい`;

function parseEditableForNewLines(node:ChildNode) {
    let out = "";
    let isNewLine = true;
    node.childNodes.forEach((child) => {
        // child.textContent
        if (child.nodeName === 'BR') {
            // BRs are always line breaks which means the next loop is on a fresh line
            out += '\n';
            isNewLine = true;
            return;
        }

        // We may or may not need to create a new line
        if (child.nodeName === 'DIV' && !isNewLine) {
            // Divs create new lines for themselves if they aren't already on one
            out += '\n';
        }
        isNewLine = false;
        // Add the text content if this is a text node:
        if (child.nodeType === 3 && child.textContent) {
            out += child.textContent;
        }

  
        out += parseEditableForNewLines(child);
        // console.log(out)
    });
    return out;
}

export default function Type() {

    // const [ selected, setSelected ] = useState<any|null>(null);

    // const lines = useMemo(() => {
    //     return text.split("\n").map((line) => {
    //         return {
    //             text: line,
                
    //         }
    //     });
    // }, [text]);

    // return (
    //     <main className={styles.main}>
    //         <TokenContext>
    //             <div className={styles.text}>
    //                 {/* <h3>Search</h3> */}
    //                 {/* <input /> */}

    //                 <p>
    //                     {lines.map((line, i) => (<LineComponent key={i} text={line.text} setSelected={setSelected}/>))}
    //                 </p>
    //             </div>
    //             <TokenPreview token={selected}/>
    //         </TokenContext>
    // </main>);

    const editable = useRef<HTMLDivElement>(null!);

    const [ textContent, setTextContent ] = useState("");

    useEffect(() => {
    //   main.current.appendChild();
    }, []);

    // const elementChanged = 
  
    const updateEditor = (e : FormEvent) => {
        // console.log("update", e);
        // console.log("text", parseEditableForNewLines(editable.current));
        // setTextContent(parseEditableForNewLines(editable.curre));
        setTextContent(editable.current.value ?? "");
    }
    
    const setSelected = () => {

    }

    return <main  className={styles.main}>
            <TokenContext>
        <div className={styles["editable-container"]}>
            <div className={styles["editable-view"]}>
            {textContent.split("\n").map((line, i) => (<LineComponent key={i} text={line} setSelected={setSelected}/>))}
            </div>
            <textarea ref={editable} autoCorrect="false" className={styles["text-input"]} onInput={updateEditor}>

            </textarea>
        </div>
        </TokenContext>
    </main>
}


function useTokenization(text : string) : any[]|null {

    const [ tokenization, setTokenization ] = useState<any[]|null>(null);
    useEffect(() => {
        fetch(`/api/tokenize/jp/?q=${encodeURIComponent(text)}`)
            .then((res) => res.json())
            .then((result) => {
                setTokenization(result.result);
            });
    }, [text]);

    return tokenization
}

function LineComponent({ text, setSelected } : { text: string, setSelected:any }) {

    const tokenization = useTokenization(text);


    if(tokenization)
        return <>
            {tokenization.map((token:any, i) => (<TokenComponent token={token} key={i} setSelected={setSelected}/>))}
            <br/>
        </>
    else
        return <>
            {text}
            <br/>
        </>
}