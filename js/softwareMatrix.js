console.log('softwareMatrix.js - 12/2020 - Adam Wise');

/** the goal here is to create an interactive table showing software compatiblity 
 * 
 * What I'd like to do is this: 
 * a function createTable() that looks at active cameras and software entries, and creates an entry for each
 * 
*/

function caseInsensAlphabetize(a,b){
    if(a.toLowerCase() > b.toLowerCase()){
        return 1;
    }
    if(a.toLowerCase() < b.toLowerCase()){
        return -1;
    }
    return 0;
}
// application environmental variables
var app = {
    activeCameras : [], // what cameras should be shown
    activeSoftware : [], // what software should be shown
    availableCameras : Object.keys(compatibilityChart).sort(caseInsensAlphabetize), // what camera models are available
    availableSoftware : Object.keys(compatibilityChart[Object.keys(compatibilityChart)[0]]).sort(caseInsensAlphabetize), // what software entries are available
};

function createTable(activeCameras, activeSoftware){
    var tableDiv = d3.select("#resultTableDiv");
    
    // remove old results
    tableDiv.selectAll("table").remove()

    // append a new table
    var table = tableDiv
                .append("table")
                .classed("resultTable", true);

    var headRow = table.append("tr")
    headRow.append("td").text("Camera");
    for ( var i in app.activeSoftware){

    }

    for( var i in app.activeCameras){
        var cam = app.activeCameras[i];
        var tr = table.append("tr")
        tr.append("td").text(cam)

        for (var j in app.activeSoftware){
            var sw = app.activeSoftware[j];
            if (compatibilityChart[cam][sw] == "true"){
                tr.append("td").classed("compatible", true)
            }
            if (compatibilityChart[cam][sw] == "false"){
                tr.append("td").classed("incompatible", true)
            }

        }
    }
}

// info on the available software packages and cameras is in place already in compatibility.js

// add some cameras and software to test
app.activeSoftware = ["AstroControl", "cellSens Dimension", "WinFluor", "Zen Blue", "PYTHON", "Micro-manager"];
app.activeCameras = ["Balor  17-12", "iDus 401", "IDus 416", "iDus 420"];
createTable(app.activeCameras, app.activeSoftware);