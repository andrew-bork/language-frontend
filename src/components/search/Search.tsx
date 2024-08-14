"use client"
import { useRouter } from "next/navigation";
import styles from "./search.module.css";
import { FormEvent, useState } from "react";


export default function Search() {

    const router = useRouter();

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        try {
            const formData = new FormData(event.currentTarget)
            router.push(`/search/${encodeURIComponent(formData.get("search") as string)}`);
  
        } catch (error) {
            console.error(error)
        } finally {

        }
    }

    const [ isDraggingFile, setIsDraggingFile ] = useState(false);

    return <form className={styles["search-section"]} onSubmit={onSubmit}
                onDragOver={(e) => {
                    e.preventDefault();

                }}
                onDragEnter={(e) => {
                    setIsDraggingFile(true);
                    e.preventDefault();
                }}
                onDragExit={(e) => {
                    setIsDraggingFile(false);
                    e.preventDefault();
                }}
                onDrop={(e) => {
                    // alert("DROP DETECTED");
                    e.preventDefault();
                    let file = null;
                    if(e.dataTransfer.items) {
                        for(let i = 0; i < e.dataTransfer.items.length; i ++ ) {
                            if(e.dataTransfer.items[i].kind === "file") {
                                file = e.dataTransfer.items[i].getAsFile();
                                break;
                            }
                        }
                    }else {
                        file = e.dataTransfer.files[0];
                    }

                    if(file) {
                        // console.log(e.currentTarget);
                        const data = new FormData();

                        data.append("image", file);

                        fetch("/api/image/ocr", {
                            method: "POST",
                            body: data,
                        }).then(res => res.json()).then(console.log);
                    }
                }}
            >
            <div className={styles["text-zone"] + " " + (isDraggingFile ? styles["hidden"] : "")}>
                <input name="search" autoCorrect="false" className={styles["text-input"]}/>
                <button className={styles["submit"]} type="submit">Search</button>
            </div>
            <div className={styles["drop-zone"] + " " + (!isDraggingFile ? styles["hidden"] : "")}>
                Drop to search by image.
            </div>
        </form>
}