import React, {createContext, useContext, useState} from "react";

interface TrainingContextProps {
    score : number;
    updateScore : (newScore : number) => void;
}

const TrainingContext = createContext<TrainingContextProps>({0, });

export const TrainingProvider = ({ children }) => {
    const [score, setScore] = useState(0);

    const updateScore = (newScore) => {
        setScore(newScore);
    }

    return(
        <TrainingContext.Provider value={{score, updateScore}}>
            {children}
        </TrainingContext.Provider>
    );
};

export const useTrainingContext = () => {
    return useContext(TrainingContext);
};