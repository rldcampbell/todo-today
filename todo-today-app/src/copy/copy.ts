import en from "@/copy/en.json"

export type CopyKey = keyof typeof en

export const copy = (key: CopyKey) => en[key]
