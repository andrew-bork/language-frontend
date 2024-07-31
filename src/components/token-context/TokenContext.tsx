import { JPToken } from "@/util/token-type";
import { createContext, useContext, useEffect, useState } from "react";

export type Definition = {
    readings: string[],
    token: string,
    definitions: string[],
};

export type DefinitionMap = {
    [key:string]: Definition[],
};

export type TokenContextType = {

    definitions: DefinitionMap,
    setDefinitions: React.Dispatch<React.SetStateAction<DefinitionMap>>
};

const _TokenContext = createContext<TokenContextType>({
    definitions: {},
    setDefinitions: ()=>{},
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
            console.log(base);
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

export function TokenContext({ children } : { children : React.ReactNode}) {

    const [ definitions, setDefinitions ] = useState<DefinitionMap>({});

    return <_TokenContext.Provider value={{
        definitions,
        setDefinitions,
    }}>{children}</_TokenContext.Provider>
}