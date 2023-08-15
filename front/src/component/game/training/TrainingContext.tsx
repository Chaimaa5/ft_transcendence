import React, {createContext, useContext, useState} from "react";

interface TrainingContextProps {
    score : number;
    updateScore : (newScore : number) => void;
	gameEnded : boolean;
	setEndGame : () => void;
}

const TrainingContext = createContext<TrainingContextProps | undefined>(undefined);

export const TrainingProvider = ({ children }) => {
    const [score, setScore] = useState(0);
	const [gameEnded, setGameEnded] = useState(false);

    const updateScore = (newScore) => {
        setScore(newScore);
    }

	const setEndGame = () => {
		setGameEnded(true);
	}

    return(
        <TrainingContext.Provider value={{score, gameEnded, updateScore, setEndGame}}>
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