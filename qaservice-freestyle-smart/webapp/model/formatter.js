sap.ui.define(function () {
    function createDiffMap(sElementary, sBasic, sAdvanced, sExpert) {
        const elementary = sElementary;
        const basic = sBasic;
        const advanced = sAdvanced;
        const expert = sExpert;

        return {
            defineAccordingToDiffId(sId) {
                switch (sId) {
                    case "891a0c87-5825-b3d7-d94d-243a77a314b6":
                        return elementary;
                    case "af7d706e-199c-f4e9-b51e-3ecd815fd3b4":
                        return basic;
                    case "7a8eec66-b5a4-5c59-f4c7-b844cb506751":
                        return advanced;
                    case "405fa0bc-b8d6-946a-5997-34401cc47721":
                        return expert;
                }
            }
        }
    }

    return {
        formatDifficultyText(sId) {
            const oMap = createDiffMap("Elementary", "Basic", "Advanced", "Expert");
            return oMap.defineAccordingToDiffId(sId);
        },

        formatDifficultyState(sId) {
            const oMap = createDiffMap("Information", "Success", "Warning", "Error");
            return oMap.defineAccordingToDiffId(sId);
        }
   };
});