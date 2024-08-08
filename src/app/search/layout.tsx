
import Search from "@/components/search/Search";
import styles from "./page.module.css";
import { FormEvent } from "react";


export default function SearchLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return <div  className={styles.main}>
      <Search/>
      {children}
    </div>
}