import { useEffect, useState } from "react";
import useFirebaseFirestoreContext from "./useFirebaseFirestoreContext";

const levels: any = {
    'Seedling': 10,
    'Hatchee': 20,
    'Sprout': 40,
    'Stem': 80,
    'Flower': 120,
    'Creature': 160,
    'Human': 220
}

const useGetLevel = () => {
    const { dbUser } = useFirebaseFirestoreContext()
    const [ level, setLevel ] = useState<string>()
    useEffect(() => {
        let newLevel;
        for(let attr in levels){
            console.log(levels[attr], dbUser?.xp)
            if (levels[attr] > dbUser?.xp) break
            else newLevel = attr
        }
        setLevel(newLevel)
    }, [dbUser])
    return { level }
}

export default useGetLevel