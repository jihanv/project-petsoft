"use client"

import { createContext, useState } from "react"

export const SearchContext = createContext<TSearchContext | null>(null)

export default function SearchContextProvider({ children }: SearchContextProviderProps) {

    //State
    const [searchQuery, setSearchQuery] = useState("")

    //Derived State

    //Event Handler
    const handleChangeSearchQuery = (newValue: string) => {
        setSearchQuery(newValue)
    }

    return (
        <SearchContext.Provider
            value={{
                searchQuery,
                handleChangeSearchQuery
            }}>
            {children}
        </SearchContext.Provider>
    )
}

export type TSearchContext = {
    searchQuery: string;
    handleChangeSearchQuery: (newValue: string) => void;
};

export type SearchContextProviderProps = {
    children: React.ReactNode;
};
