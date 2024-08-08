"use client"

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useMemo, useState } from "react";

import jpTokenStyles from "./jp-token.module.css"
import TokenComponent from "@/components/token-component/TokenComponent";
import TokenPreview from "@/components/token-preview/TokenPreview";
import { TokenContext } from "@/components/token-context/TokenContext";


const text1 = `やっと眼を覚ましたかい　それなのになぜ眼も合わせやしないんだい？
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

どこから話すかな　君が眠っていた間のストーリー
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

const text2 = `
何も持たずに　生まれ堕ちた僕
永遠の隙間で　のたうち回ってる

諦めた者と　賢い者だけが
勝者の時代に　どこで息を吸う

支配者も神も　どこか他人顔
だけど本当は　分かっているはず

勇気や希望や　絆とかの魔法
使い道もなく　オトナは眼を背ける

それでもあの日の　君が今もまだ
僕の全正義の　ど真ん中にいる

世界が背中を　向けてもまだなお
立ち向かう君が　今もここにいる

愛にできることはまだあるかい
僕にできることはまだあるかい

君がくれた勇気だから　君のために使いたいんだ
君と分け合った愛だから　君とじゃなきゃ意味がないんだ

愛にできることはまだあるかい
僕にできることは　まだあるかい

運命(サダメ)とはつまり　サイコロの出た目？
はたまた神の　いつもの気まぐれ

選び選ばれた　脱げられぬ鎧
もしくは遥かな　揺らぐことない意志

果たさぬ願いと　叶わぬ再会と
ほどけぬ誤解と　降り積もる憎悪と

許し合う声と　握りしめ合う手を
この星は今日も　抱えて生きてる

愛にできることはまだあるかい？
僕にできることはまだあるかい

君がくれた勇気だから　君のために使いたいんだ
君と育てた愛だから　君とじゃなきゃ意味がないんだ

愛にできることはまだあるかい
僕にできることは　まだあるかい

何もない僕たちに　なぜ夢を見させたか
終わりある人生に　なぜ希望を持たせたか
なぜこの手をすり抜ける　ものばかり与えたか
それでもなおしがみつく　僕らは醜いかい
それとも、きれいかい

答えてよ
愛の歌も　歌われ尽くした　数多の映画で　語られ尽くした
そんな荒野に　生まれ落ちた僕、君　それでも
愛にできることはまだあるよ
僕にできることはまだあるよ
`;

const text3 = `古池や蛙飛び込む水の音`;
const text4 = `今日の一枚`;
const text5 = `エペは、伝統的なフェンシングで用いられていた決闘用の武器に最も近い剣である。
フルーレと対照的に重量があり、
断面が三角形で曲がりにくく長いブレードと大きくて丸い[要曖昧さ回避]お椀型の鍔（ガルト）を持つ。
電気剣での突きが有効となるには7.50Nの力が剣先に加わらなければならない。
伝統的なフェンシングでは相手の上着を確実に捉えることができるように、
剣先（ポアン）に三つ又の部品[要曖昧さ回避]を取り付けることもあった。
現在では剣身に二本の電線を埋め込み、
フルーレより大きめの電気スイッチ[要曖昧さ回避]である剣先（ポアン）が必須である。
同時突き（相打ち）が有効であり、
攻撃権の概念も存在しない。
さらに後述のように有効面が広いため、
エペの試合は極端に防御的で慎重なものになる傾向がある。`;
const text6 = `折り紙 大田`;
const text = text2;


export default function Home() {

    const [ selected, setSelected ] = useState<any|null>(null);

    const lines = useMemo(() => {
        console.log(text.split("\n"));
        return text.split("\n").map((line) => {
            return {
                text: line,
            }
        });
    }, [text]);

    return (
        <main className={styles.main}>
            <TokenContext>
                <div className={styles.text}>
                    {/* <h3>Search</h3> */}
                    {/* <input /> */}

                    <p>
                        {lines.map((line, i) => (<LineComponent key={i} text={line.text} setSelected={setSelected}/>))}

                    </p>
                </div>
                <TokenPreview token={selected}/>
            </TokenContext>
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