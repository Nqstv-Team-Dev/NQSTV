(function () {
    "use strict";

    var projects = [
        { name: "Ford Service Center and Office", loc: "BGC", tag: "Cost Plan" },
        { name: "Araneta Center Underground Utilities", loc: "Cubao", tag: "Pre-tender" },
        { name: "Araneta Center Link Bridge", loc: "Kia Theater to GT", tag: "Pre-tender" },
        { name: "SSS Alimall Office", loc: "Cubao", tag: "Cost Plan" },
        { name: "Tuguegarao Public Market", loc: "Tuguegarao", tag: "Bill of Quantities" },
        { name: "Franklin Baker Davao", loc: "Davao", tag: "Arbitration" },
        { name: "First Philec Admin and Utility Building", loc: null, tag: null },
        { name: "One Serra Residence", loc: null, tag: null },
        { name: "PNB Divisoria BLDG", loc: "Divisoria", tag: null },
        { name: "Leclands Showroom", loc: null, tag: null },
        { name: "Mandala Residence", loc: null, tag: null },
        { name: "ANG Residence", loc: null, tag: null },
        { name: "Tuguegarao Market", loc: "Tuguegarao", tag: null },
        { name: "54 Clarendon", loc: "UK", tag: null },
        { name: "62 Threadneedle", loc: "UK", tag: null },
        { name: "Gotobox Restaurant", loc: null, tag: "Fitout" },
        { name: "Convo Coffee", loc: null, tag: "Fitout" },
        { name: "Tagaytay Curtain", loc: "Tagaytay", tag: null },
        { name: "Panay House", loc: null, tag: null },
        { name: "Renovation of Gat Tayaw House", loc: null, tag: "Renovation" },
        { name: "NCRPO Medical Center", loc: null, tag: null },
        { name: "PMAAAI Building", loc: null, tag: "Leadership Center" },
        { name: "Canadian Embassy", loc: null, tag: null },
        { name: "Aboitiz Meeting Room", loc: null, tag: "Interior" },
        { name: "Uniqlo Facade", loc: null, tag: "Facade" },
        { name: "Uniqlo Fitout", loc: null, tag: "Fitout" },
        { name: "Tacloban Temple Meeting Room", loc: "Tacloban", tag: "Interior" },
        { name: "Tacloban Temple", loc: "Tacloban", tag: null },
        { name: "JLL Facade / British Embassy Manila", loc: "Manila", tag: "Facade" },
        { name: "Soundcheck Warehouse Expansion", loc: null, tag: "Expansion" },
        { name: "FEU Renovation", loc: null, tag: "Renovation" },
        { name: "Tuguegarao Temple Ancillary Building", loc: "Tuguegarao", tag: null },
        { name: "P&G Manila Seven Neo", loc: "Manila", tag: null }
    ];

    function makeText(value) {
        return document.createTextNode(value);
    }

    function renderProjects(list) {
        var grid = document.getElementById("minorProjectGrid");
        var pill = document.getElementById("minorProjectCount");

        if (!grid || !pill) {
            return;
        }

        pill.textContent = list.length + " project" + (list.length === 1 ? "" : "s");
        grid.textContent = "";

        if (list.length === 0) {
            var empty = document.createElement("div");
            empty.className = "minor-project-empty-state";
            empty.textContent = "No matching projects";
            grid.appendChild(empty);
            return;
        }

        list.forEach(function (project) {
            var item = document.createElement("article");
            item.className = "minor-project-item";

            var title = document.createElement("p");
            title.className = "minor-project-name";
            title.appendChild(makeText(project.name));
            item.appendChild(title);

            if (project.loc) {
                var location = document.createElement("p");
                location.className = "minor-project-sub";
                location.appendChild(makeText(project.loc));
                item.appendChild(location);
            }

            if (project.tag) {
                var tag = document.createElement("span");
                tag.className = "minor-project-tag";
                tag.appendChild(makeText(project.tag));
                item.appendChild(tag);
            }

            grid.appendChild(item);
        });
    }

    function filterProjects() {
        var input = document.getElementById("minorProjectSearch");
        var query = input ? input.value.trim().toLowerCase() : "";

        var filtered = query
            ? projects.filter(function (project) {
                return project.name.toLowerCase().indexOf(query) !== -1 ||
                    (project.loc && project.loc.toLowerCase().indexOf(query) !== -1) ||
                    (project.tag && project.tag.toLowerCase().indexOf(query) !== -1);
            })
            : projects;

        renderProjects(filtered);
    }

    document.addEventListener("DOMContentLoaded", function () {
        var input = document.getElementById("minorProjectSearch");

        if (input) {
            input.addEventListener("input", filterProjects);
        }

        renderProjects(projects);
    });
})();
