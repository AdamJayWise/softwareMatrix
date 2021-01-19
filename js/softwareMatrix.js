console.log('softwareMatrix.js - 12/2020 - Adam Wise');

// misc function unrelated to SCIENCE

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


// The actual main part of this:
function createTable(activeCameras, activeSoftware){

    // append a new table
    var table = d3.select("#resultTable")
                .classed("displayTable", true);

    table.selectAll("tr").remove();

    var headRow = table.append("tr")
    
    headRow.append("td").classed("cornerTD", true);
    
    for (var q in app.activeCameras){
        var thisHeader = headRow.append("th")

        var vertLabelDiv = thisHeader
            .classed("cameraLabelTD", true)
            .append('div')
        
        vertLabelDiv
            .append("a")
            .text(app.activeCameras[q])
            
            var labelBBox = vertLabelDiv.select('a').node().getBoundingClientRect();
            var headerHeight = parseFloat(headRow.style("height"))

            thisHeader.style("height", labelBBox.height + 10);
            thisHeader.style("max-width", labelBBox.width);
            vertLabelDiv.style("margin-top", -labelBBox.height/2)

          
    }

    for( var i in app.activeSoftware){
        var sw = app.activeSoftware[i];
        var tr = table.append("tr")
        tr.append("td")
            .text(sw)
            .classed("softwareLabelTd", true)

        for (var j in app.activeCameras){
            var cam = app.activeCameras[j];
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
app.activeSoftware = Object.keys(compatibilityChart[Object.keys(compatibilityChart)[0]]).sort(caseInsensAlphabetize);
app.activeCameras = ["Balor  17-12", "iDus 401", "IDus 416", "iDus 420"];
createTable(app.activeCameras, app.activeSoftware);

// add a callback to the "show all button"
d3.select("#showAllButton")
    .on('click', function(){
        app.activeCameras = app.availableCameras;
        //app.activeSoftware = app.availableSoftware;
        createTable();
    })