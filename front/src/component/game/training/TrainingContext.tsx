import React, {createContext, useContext, useState} from "react";

interface TrainingContextProps {
    score : number;
    updateScore : (newScore : number) => void;
}

const TrainingContext = createContext<TrainingContextProps | undefined>(undefined);

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

export const useTrainingContext = () : TrainingContextProps => {
    const context = useContext(TrainingContext);
    if(!context) {
        throw new Error('useTraningContext must be used with a TrainingProvider')
    }
    return(context);
};