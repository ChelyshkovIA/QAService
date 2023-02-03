sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'questions/test/integration/FirstJourney',
		'questions/test/integration/pages/QuestionsList',
		'questions/test/integration/pages/QuestionsObjectPage'
    ],
    function(JourneyRunner, opaJourney, QuestionsList, QuestionsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('questions') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheQuestionsList: QuestionsList,
					onTheQuestionsObjectPage: QuestionsObjectPage
                }
            },
            opaJourney.run
        );
    }
);