d3.selectAll(".tabledata").on("click", d => {

    d3.event.preventDefault();
    d3.select("#accordion").remove()
    tar = d3.event.target.id
    choice = tar.toLowerCase()
    dataPage = d3.select("#data-area")
    url = "/api/" + choice
    console.log(url)
        d3.json("/api/" + choice).then(data => {
            var dataAccordion = dataPage.append("div").attr("id", "accordion")
            data.forEach(record => {
                console.log(d3.keys(record))
                topkeys = d3.keys(record)
                var dataCard = dataAccordion.append("div")
                    .attr("class", "card")


                topkeys.forEach(record1 => {
                    dataCardHeader = dataCard.append("div")
                        .attr("class", "card-header d-inline-flex justify-content-between")
                        .attr("id", record1 + "header")
                    dataH5 = dataCardHeader.append("h5")
                        .attr("class", "mb-0 d-inline-flex")
                        
                    var dataButton = dataH5.append("button");
                        dataButton.attr("class", "btn btn-link collapsed d-inline-flex");
                        dataButton.attr("id", record1 + "button");
                        dataButton.attr("data-toggle", "collapse");
                        dataButton.attr("data-target", "#" + record1 + "main");

                        dataButton.text(function() {
                            if (record1 == "reg") {
                                return "Regular Season Data"
                            }
                            if (record1 == "playoffs") {
                                return "Playoff Data"
                            }
                        })

                    var dataForm = dataCardHeader.append("form")
                        .attr("class", "form-inline")

                    var dataCriteria = dataForm.append("select")
                        .attr("class", "custom-select")
                        .attr("id", "criteria-selection" + record1)

                    var searchDefault = dataCriteria.append("option")
                                        .attr("selected", "")
                                        .text("Search Criteria")

                    var searchName = dataCriteria.append("option")
                                        .attr("value", "name")
                                        .text("Team")
                    var searchDate = dataCriteria.append("option")
                                        .attr("value", "date")
                                        .text("Season")

                    var dataSearch = dataForm.append("input")
                        .attr("class", "form-control mr-sm-2 float-right")
                        .attr("id", "search-input" + record1)
                        .attr("type", "search")
                        .attr("placeholder", "Search")
                        .attr("data-value", record1)
                        // .style("margin-top", "20px")

                    var dataButton = dataForm.append("button")
                        .attr("class", "btn btn-outline-success my-2 my-sm-0 align-middle")
                        .attr("id", "filter-btn")
                        .attr("type", "submit")
                        .attr("value", record1)
                        .text("Search")

                    var dataButton2 = dataForm.append("button")
                        .attr("class", "btn btn-outline-danger my-2 my-sm-0 align-middle")
                        .attr("id", "clear-btn")
                        .attr("type", "submit")
                        .attr("href", "#")
                        .attr("value", record1)
                        .text("Clear")
                        // .style("margin-top", "50px !important")

                    var dataMain = dataCard.append("div");
                        dataMain.attr("id", record1 + "main");
                        dataMain.attr("class", "collapse");
                        dataMain.attr("data-parent", "#accordion");

                        dataBody = dataMain.append("div");
                        dataBody.attr("class", "card-body")
                                .attr("id", record1 + "databody");

                        var dataTable = dataBody.append("table");
                        dataTable.attr("class", "table table-striped")
                                    .attr("id", record1 + "table");
                        var dataHead = dataTable.append("thead");
                        var dataRow = dataHead.append("tr");

                        data1 = record[record1]

                        Object.entries(record[record1][0]).forEach(([key, value]) => {
                            var tableCol = dataRow.append("th")
                            tableCol.attr("scope", "col");
                            tableCol.text(key);
                            tableCol.style("font-size", ".7rem");
                        })
                        var dataBody = dataTable.append("tbody")
                            .attr("id", record1 + "body");
                        data1.forEach((entry) => {
                        /*console.log(entry)*/
                        var dataRow = dataBody.append("tr");
                            Object.entries(entry).forEach(([key, value]) => {
                                if (key == "DATE") {
                                    tableCell = dataRow.append("td");
                                    tableCell.text(value);
                                }else{
                                tableCell = dataRow.append("td");
                                tableCell.text(value);
                                }
                            });

                        })

                })
                    var filter_button = d3.selectAll("#filter-btn")

                    filter_button.on("click", function() {
                        d3.event.preventDefault();
                        console.log("working")

                        
                        var inputSeason = this.value

                        var inputElement = d3.select("#search-input" + inputSeason).property("value");
                        var inputCriteria = d3.select("#criteria-selection" + inputSeason).node().value;
                        console.log(data1)
                        console.log(data[inputSeason])
                        

                        console.log(inputSeason)

                        if (inputCriteria == "name") {
                            var filteredData = data1.filter(entry => entry.team === inputElement)
                            console.log(filteredData)

                            r = d3.select("#" + inputSeason + "body").selectAll("tr")
                            d = d3.select("#" + inputSeason + "body").selectAll("td")

                            r.remove()
                            d.remove()

                            filteredData.forEach((eb) => {
                                var row = d3.select("#" + inputSeason + "body").append("tr")
                                Object.entries(eb).forEach(([key, value]) => {
                                    var cell = d3.select("#" + inputSeason + "body").append("td")
                                    cell.text(value)
                                })
                            })
                        }
                        if (inputCriteria == "date") {
                            var filteredData = data1.filter(entry => entry.year == inputElement)
                            console.log(filteredData)

                            r = d3.select("#" + inputSeason + "body").selectAll("tr")
                            d = d3.select("#" + inputSeason + "body").selectAll("td")

                            r.remove()
                            d.remove()

                            filteredData.forEach((eb) => {
                                var row = d3.select("#" + inputSeason + "body").append("tr")
                                Object.entries(eb).forEach(([key, value]) => {
                                    var cell = d3.select("#" + inputSeason + "body").append("td")
                                    cell.text(value)
                                })
                            })
                        }


                    })
                    clearb = d3.selectAll("#clear-btn").on("click", function() {
                        d3.event.preventDefault()
                        loc = this.value
                        head = d3.select("#" + loc + "header")
                        console.log(loc)

                        d3.json("/api/" + choice).then(data => {
                            console.log(data[0][loc])
                            tableD = data[0][loc]

                            r = d3.select("#" + loc + "body").selectAll("tr")
                            d = d3.select("#" + loc + "body").selectAll("td")

                            r.remove();
                            d.remove()
                            
                            tableD.forEach((eb) => {
                                var row = d3.select("#" + loc + "body").append("tr")
                                Object.entries(eb).forEach(([key, value]) => {
                                    var cell = d3.select("#" + loc + "body").append("td")
                                    cell.text(value)
                                })
                            })
                        })

                    })

            })


        })



})





