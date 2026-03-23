"use client";
import { useEffect, useState } from "react";

export type MyListItem = { url: string; title: string | null; image?: string | null; postId?: number };

const KEY = "amai:mylist:v1";

export function useMyList() {
  const [list, setList] = useState<MyListItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setList(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: MyListItem[]) => {
    setList(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const add = (item: MyListItem) => {
    if (list.find((i) => i.url === item.url)) return;
    persist([item, ...list]);
  };

  const remove = (url: string) => {
    persist(list.filter((i) => i.url !== url));
  };

  const toggle = (item: MyListItem) => {
    if (list.find((i) => i.url === item.url)) remove(item.url);
    else add(item);
  };

  const has = (url: string) => list.some((i) => i.url === url);

  return { list, add, remove, toggle, has };
}


