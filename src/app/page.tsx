"use client"

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useMemo, useState } from "react";


const text = `やっと眼を覚ましたかい　それなのになぜ眼も合わせやしないんだい？
「遅いよ」と怒る君　これでもやれるだけ飛ばしてきたんだよ
心が身体を追い越してきたんだよ

君の髪や瞳だけで胸が痛いよ
同じ時を吸いこんで離したくないよ
遥か昔から知る　その声に
生まれてはじめて　何を言えばいい？

君の前前前世から僕は　君を探しはじめたよ
そのぶきっちょな笑い方をめがけて　やってきたんだよ
君が全然全部なくなって　チリヂリになったって
もう迷わない　また1から探しはじめるさ
むしろ0から　また宇宙をはじめてみようか

どっから話すかな　君が眠っていた間のストーリー
何億　何光年分の物語を語りにきたんだよ　けどいざその姿この眼に映すと

君も知らぬ君とジャレて　戯れたいよ
君の消えぬ痛みまで愛してみたいよ
銀河何個分かの　果てに出逢えた
その手を壊さずに　どう握ったならいい？

君の前前前世から僕は　君を探しはじめたよ
その騒がしい声と涙をめがけ　やってきたんだよ
そんな革命前夜の僕らを誰が止めるというんだろう
もう迷わない　君のハートに旗を立てるよ
君は僕から諦め方を　奪い取ったの

私たち越えれるかな　この先の未来　数えきれぬ困難を
言ったろう？　二人なら　笑って返り討ちにきっとできるさ
君以外の武器は　他にはいらないんだ

前前前世から僕は　君を探しはじめたよ
そのぶきっちょな笑い方をめがけて　やってきたんだよ
君が全然全部なくなって　チリヂリになったって
もう迷わない　また1から探しはじめるさ
何光年でも　この歌を口ずさみながら`;

export default function Home() {

    const lines = useMemo(() => {
        return text.split("\n").map((line) => {
            return {
                text: line,
                
            }
        });
    }, [text]);

    return (
        <main className={styles.main}>
        <div className={styles.description}>
            {/* <h3>Search</h3> */}
            {/* <input /> */}

            <p>
                {lines.map((line, i) => (<LineComponent key={i} text={line.text}/>))}
            </p>
        </div>
    </main>);
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

function LineComponent({ text } : { text: string }) {

    const tokenization = useTokenization(text);


    if(tokenization)
        return <>
            {tokenization.map((token:any, i) => (<TokenComponent token={token} key={i} />))}
            <br/>
        </>
    else
        return <>
            {text}
            <br/>
        </>
}

function TokenComponent({ token } : { token : any }) {
    return <span className={styles["jp-token"]}>{token[0]}</span>
}
// function JapaneseViewer {

// }