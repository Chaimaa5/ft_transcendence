import { create } from "zustand"

interface onChange
{
    fetchChange: number,
    setFetchChange: () => void
}

const useFetchOnChange =  create<onChange>(set => ({
    fetchChange: 0,
    setFetchChange: () => set(store => ({fetchChange: store.fetchChange + 1}))
}))

export default useFetchOnChange;