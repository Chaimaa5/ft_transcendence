import React from "react";
import { TrainingProvider } from "./TrainingContext";
import { TrainingComponent } from "./TrainingComponent";

export const TrainingApp = () => {
  return (
    <TrainingProvider>
        <TrainingComponent />
    </TrainingProvider>
  );
}
