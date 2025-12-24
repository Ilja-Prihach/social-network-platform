'use client'

import styles from "./HomePage.module.scss";
import {Input} from "@/shared/ui/Input/Input";


type HomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const normalizeParam = (value?: string | string[]): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export function HomePage({ searchParams = {} }: HomePageProps) {
  return (
        <>
          VrontEnd
        </>


  );
}
