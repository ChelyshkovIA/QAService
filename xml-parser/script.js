const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const utils = require("./lib/utils.js");
const fs = require("fs");
const XML = require("xml-obj");

const _aDifficulties = createDifficulties();
const _aProgress = createProgressStatuses(); 
const _aTopics = [];
const _aGroups = [];
const _aQuestions = [];

main();

Promise.all([
    generateTopicsCSV(),
    generateGroupsCSV(),
    generateDifficultiesCSV(),
    generateQuestionsCSV(),
    generatePrgressStatusCSV()
]).then(() => {
    console.log("******************************** DONE ********************************");
});

function main() {
    const aFileNames = ["btp", "fiori-elements", "git", "js-core", "js-dom", "odata-v2", "odata-v4", "sapui5"];

    aFileNames.forEach(sFileName => {
        const oXML = getXMLObjFromFile(sFileName);
        const aRows = getTableRows(oXML);

        const sTopicID = utils.guid();
        const sTopicName = getTopicName(aRows[1]);
        
        aRows.slice(2).forEach(oTableRow => {
            const sGroupID = utils.guid();
            const sGroupName = getGroupName(oTableRow);
            
            const aCells = getRowCells(oTableRow);

            const aTempDiff = aCells.length == 5 ?
                    [_aDifficulties[0], _aDifficulties[1], _aDifficulties[2], _aDifficulties[3]] :
                    [_aDifficulties[1], _aDifficulties[2], _aDifficulties[3]];

            aCells.slice(1).forEach((oCell, nIdx) => {
                let tn = sTopicName;
                let gn = sGroupName;

                const aLists = getNodeLists(oCell);

                if (!aLists) {
                    return;
                }

                aLists.forEach(oList => {
                    const aListItems = getNodeListItems(oList);

                    aListItems.forEach(oItem => {

                        const sSubTexts = getSubTexts(oItem);

                        const sQuestionTopicID = sTopicID;
                        const sQuestionGroupID = sGroupID;

                        const sQuestionDifficultyID = aTempDiff[nIdx].ID;
                        const sQuestionProgressStatusID = _aProgress[0].ID;
                        const sQuestionID = utils.guid();
                        const aTexts = getNodeTexts(oItem);

                        const sQuestionHeader = aTexts.reduce((textStr, oText) => {
                            const aSpans = getNodeSpans(oText);

                            textStr += aSpans.reduce((spanStr, oSpan) => {
                                spanStr += getSpanText(oSpan);
                                return spanStr
                            }, "");

                            return textStr;
                        }, "");
                        const sQuestionAnswer = "";

                        const sQuestionText = sQuestionHeader + " \n " + sSubTexts;

                        createQuestion(sQuestionID, sQuestionTopicID, sQuestionGroupID, sQuestionDifficultyID, sQuestionText, sQuestionAnswer, sQuestionProgressStatusID);
                    });
                });
            });

            createGroup(sGroupID, sTopicID, sGroupName);
        });
        

        createTopic(sTopicID, sTopicName);
    });
}

function createGroup(sGroupID, sTopicID, sGroupName) {
    _aGroups.push({
        ID: sGroupID,
        topic_ID: sTopicID,
        name: sGroupName
    });
}

function createTopic(sTopicID, sTopicName) {
    _aTopics.push({
        ID: sTopicID,
        name: sTopicName
    });
}

function createDifficulties() {
    const aNames = ["Elementary", "Basic", "Advanced", "Expert"];

    return aNames.map((sName, nIdx) => {
        return { ID: utils.guid(), name: sName, numeric: nIdx };
    });
}

function createProgressStatuses() {
    const aNames = ["None", "In Progress", "Attention", "Completed"];

    return aNames.map(sName => {
        return { ID: utils.guid(), name: sName };
    });
}

function getXMLObjFromFile(sFileName) {
    const sXMLFileContent = fs.readFileSync(__dirname + `/src-xml/${sFileName}.xml`, "utf-8");
    return XML.parse(sXMLFileContent);
}

function createQuestion(sQuestionID, sQuestionTopicID, sQuestionGroupID, sQuestionDifficultyID, sQuestionText, sQuestionAnswer, sQuestionProgressStatusID){
    _aQuestions.push({
        ID: sQuestionID,
        topic_ID: sQuestionTopicID,
        group_ID: sQuestionGroupID,
        difficulty_ID: sQuestionDifficultyID,
        progress_ID: sQuestionProgressStatusID,
        text: sQuestionText,
        answer: sQuestionAnswer
    });
}



// Selectors
function getTableRows(oXML) {
    return oXML.querySelectorAll("table:table > table:table-row");
}

function getTopicName(oCell) {
    return oCell?.["table:table-cell"]?.["text:p"]?.["text:span"]?.["@text"];
}

function getGroupName(oRow) {
    return oRow?.["table:table-cell"][0]?.["text:p"]?.["text:span"]?.["@text"];
}

function getRowCells(oNode) {
    return oNode?.["table:table-cell"];
}

function getSpanText(oSpan) {
    let str = "";
    if(oSpan["@innerXML"]) {
        oSpan["@innerXML"].forEach(span => {
            span["@text"] ? str += span["@text"] : "";
        });
    } else {
        str = oSpan["@text"];
    }

    return str;
}

function getNodeSpans(oNode) {
    const aSpans = oNode?.["text:span"];

    return aSpans.length ? aSpans : [aSpans];
}

function getNodeTexts(oNode) {
    const aTexts = oNode?.["text:p"];

    return aTexts.length ? aTexts : [aTexts];
}

function getNodeListItems(oNode) {
    const listItem = oNode?.["text:list-item"];

    return listItem.length ? listItem : [listItem];
}

function getNodeLists(oNode) {
    const list = oNode?.["text:list"];

    if (!list) return false;

    return list?.length ? list : [list];
}

function getSubTexts(oNode) {
    const aLists = getNodeLists(oNode);

    if (!aLists) return "";

    return aLists.reduce((listRes, oList) => {
        const listItems = getNodeListItems(oList);

        listRes += listItems.reduce((itemRes, listItem, nIdx) => {
            const aTexts = getNodeTexts(listItem);

            itemRes += ` \n ${++nIdx}) ` +  aTexts.reduce((textRes, oText) => {
                const aSpans = getNodeSpans(oText);

                textRes += aSpans.reduce((spanRes, oSpan) => {
                    spanRes += getSpanText(oSpan);
                    
                    return spanRes;
                }, "");

                return textRes;
            }, "");

            return itemRes;
        }, "");

        return listRes;
    }, "");
}

// csv renderers.......
function generateTopicsCSV() {
    const csvWriter = createCsvWriter({
        path: "./csv-output/Topics.csv",
        header: [
            {id: "ID", title: "ID"},
            {id: "name", title: "name"}
        ]
    });

    return csvWriter.writeRecords(_aTopics);
}

function generateGroupsCSV() {
    const csvWriter = createCsvWriter({
        path: "./csv-output/Groups.csv",
        header: [
            {id: "ID", title: "ID"},
            {id: "name", title: "name"},
            {id: "topic_ID", title: "topic_ID"}
        ]
    });

    return csvWriter.writeRecords(_aGroups);
}

function generateDifficultiesCSV() {
    const csvWriter = createCsvWriter({
        path: "./csv-output/Difficulties.csv",
        header: [
            {id: "ID", title: "ID"},
            {id: "name", title: "name"},
            {id: "numeric", title: "numeric"}
        ]
    });

    return csvWriter.writeRecords(_aDifficulties);
}

function generatePrgressStatusCSV() {
    const csvWriter = createCsvWriter({
        path: "./csv-output/Progress.csv",
        header: [
            {id: "ID", title: "ID"},
            {id: "name", title: "name"}
        ]
    });

    return csvWriter.writeRecords(_aProgress);
}

function generateQuestionsCSV() {
    const csvWriter = createCsvWriter({
        path: "./csv-output/Questions.csv",
        header: [
            {id: "ID", title: "ID"},
            {id: "text", title: "text"},
            {id: "answer", title: "answer"},
            {id: "difficulty_ID", title: "difficulty_ID"},
            {id: "topic_ID", title: "topic_ID"},
            {id: "group_ID", title: "group_ID"},
            {id: "progress_ID", title: "progress_ID"}
        ]
    });

    return csvWriter.writeRecords(_aQuestions);
}
