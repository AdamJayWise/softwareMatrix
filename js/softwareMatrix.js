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


    // append a new table
    var table = d3.select("#resultTable")
                .classed("displayTable", true);

    table.selectAll("tr").remove();

    var headRow = table.append("tr")
    
    headRow.append("td").classed("cornerTD", true);
    
    for (var q in app.activeSoftware){
        
        var thisHeader = headRow.append("td")

        thisHeader
            .classed("softwareLabelTD", true)
            .html(`<a href = "${softwareInfo[app.activeSoftware[q]]['Link']}" >${app.activeSoftware[q]}</a>`)
            .on('mouseover', function(){
                if (activeSoftware.indexOf(d3.select(this).text())!=-1){
                    var tip = d3.select(this)
                                .append('div')
                                .classed("toolTip", true)
                                .text(softwareInfo[d3.select(this).text()]['Description']);
                };
            })
            .on('mouseleave', function(){
                d3.selectAll(".toolTip").remove();
            })
          
    }

    for( var i in app.activeCameras){
        var cam = app.activeCameras[i];
        var tr = table.append("tr")
        tr.append("td")
            .text(cam)
            .classed("cameraLabelTD", true)

        for (var j in app.activeSoftware){
            var sw = app.activeSoftware[j];
            if (compatibilityChart[cam][sw] == "true"){
                tr.append("td").classed("compatible", true).html("&#10004;")
            }
            if (compatibilityChart[cam][sw] == "false"){
                tr.append("td").classed("incompatible", true)
            }

        }
    }
}

// create a software select into #softwareSelectDiv
function createSoftwareDiv(){
    var softwareSelect = d3.select("#softwareSelect")
    softwareSelect
            .selectAll("option")
            .data(app.availableSoftware)
            .enter()
            .append("option")
            .text(d=>d)
            .attr("value",d=>d);
    softwareSelect.on('change', onChangeSelect);
}


// callback for when select is changed
function onChangeSelect(){
    app.activeSoftware = [];
    selected = d3.select(this) // select the select
        .selectAll("option:checked")  // select the selected values
        .each(function() { 
            app.activeSoftware.push(this.value);
            }); // for each of those, get its value
    createTable();
}

// ok so I'd like to create a thing where I have D3 making a div per family, then you can click to activate / deactive camera
function createCameraTree(){
    var camDiv = d3.select("#cameraTreeDiv");
    Object.keys(cameraTree).forEach(function(camType){
        var typeDiv  = camDiv
                        .append("div")
                        .text(camType + " +")
                        .on('click', function(){
                            //typeDiv.text(camType)
                            // make direct children visible
                            typeDiv.selectAll(".cameraFamily")
                                    .each(function(d,i,p){
                                        console.log(p[i]);
                                        var t = d3.select(p[i]);
                                        t.classed("hidden", !t.classed("hidden"))
                                    })
                            event.stopPropagation();
                                    
                        });
        
        Object.keys(cameraTree[camType]).forEach(function(camFam){
            var famDiv = typeDiv.append("div")
                            .classed("cameraFamily", true)
                            .classed("hidden", true)
                            .text(camFam + " +")
                            .on('click', function(){
                                // make direct children visible
                                famDiv.selectAll(".cameraModel")
                                    .each(function(d,i,p){
                                        console.log(p[i]);
                                        var t = d3.select(p[i]);
                                        t.classed("hidden", !t.classed("hidden"))
                                })
                                event.stopPropagation();
                            });

            cameraTree[camType][camFam].forEach(function(camModel){

                var modelDiv = famDiv.append("div")
                    .classed("cameraModel", true)
                    .classed("hidden", true)
                    .text(camModel)
                    .on('click', function(){
                        if(app.activeCameras.indexOf(camModel) == -1){
                            app.activeCameras.push(camModel);
                            d3.select(this).classed("active", true)
                        }
                        else {
                            app.activeCameras.splice(app.activeCameras.indexOf(camModel), 1);
                            d3.select(this).classed("active", false)
                        }
                        event.stopPropagation();
                        createTable();
                });
            });
        });


    })
}

createSoftwareDiv();
createCameraTree();
// info on the available software packages and cameras is in place already in compatibility.js

// add some cameras and software to test
app.activeSoftware = ["AstroControl", "cellSens Dimension", "WinFluor", "Zen Blue", "PYTHON", "Micro-manager"];
app.activeCameras = ["Balor  17-12", "iDus 401", "IDus 416", "iDus 420"];
createTable(app.activeCameras, app.activeSoftware);

// add a callback to the "show all button"
d3.select("#showAllButton")
    .on('click', function(){
        app.activeCameras = app.availableCameras;
        app.activeSoftware = app.availableSoftware;
        createTable();
    })