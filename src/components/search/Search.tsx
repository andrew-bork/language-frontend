"use client"
import { useRouter } from "next/navigation";
import styles from "./search.module.css";
import { FormEvent } from "react";


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

    return <form className={styles["search-section"]} onSubmit={onSubmit}>
            <input name="search" autoCorrect="false" className={styles["text-input"]}/>
            <button className={styles["submit"]} type="submit">Search</button>
        </form>
}