

var Type = {
    none: -1,
    company: 0,
    customers: 1
};

var Status = {
    none: -1,
    new: 0,
    inProgress: 1,
    inTesting: 2,
    completed: 3
};

var SortingType = {
    none: -1,
    asc: 0,
    desc: 1
};

var Project = function (projectName, dueDate, created, members, type, status, customer) {
    this.ProjectName = projectName;
    this.DueDate = dueDate;
    this.Created = created;
    this.Members = members;
    this.Type = type;
    this.Status = status;
    this.Customer = customer;
};

var data = [
    new Project('PCo', new Date(2019,12,2), new Date(2005,12,6),null,Type.customers, Status.none, 'SAP'),
    new Project('WebSped', new Date(2017,12,15), new Date(2017,12,15),null,Type.customers, Status.completed, 'LIS'),
    new Project('Outlookfinder', new Date(2017,10,12), new Date(2010,8,1),null,Type.customers, Status.inProgress, 'Vincent Payette'),
    new Project('Windows', new Date(1989,10,12), new Date(2020,12,31),null,Type.customers, Status.new, 'Microsoft'),
    new Project('Linux', new Date(1991,10,12), new Date(2020,12,31),null,Type.company, Status.inProgress, 'Torvalds')
];

var DomStrings = {
    tableBody: "tableBody",
    table: "table",
    dataColumnSortAttribute: 'data-column-sort',
    dataColumnPropertyAttribute: 'data-property',
};

function handleMenu(){
    var leftSideMenu = document.getElementById('leftSideMenu');
    var main = document.getElementById('main');
    var menuWidth = leftSideMenu.style.width;

    if(menuWidth === "0%" || menuWidth === ""){
        leftSideMenu.style.width = "10%";
        main.style.marginLeft ="10%"
        main.style.width = "90%";

    } else {
        leftSideMenu.style.width = "0%";
        main.style.marginLeft = "0%"
        main.style.width = "100%";

    }

}

function createTag(targetTag, attributes, parentTag){
    if(targetTag === null){
        return;
    }
    var tag = document.createElement(targetTag);
    if(attributes != null){
        for (var attr in attributes){
            tag.setAttribute(attr, attributes[attr]);
        }
    }
    if(parentTag) parentTag.appendChild(tag);
    return tag;
}

function getType(value){
    var name = '';
    for (var p in Type){
        if(Type[p] === value){
            name = p;
            break;
        }
    }
    return name;
};

function getStatus(value){
    var status = '';
    for (var p in Status) {
        if(Status[p] === value){
            status = p;
            break;
        }
    }
    return status;
}


var tableController = (function(){

    var initialPopulateData = function(){
        setData(data);
    };

    var setData = function(dataSet) {
        var body = document.getElementById(DomStrings.tableBody);
        var child;
        while (child = body.firstChild)
            body.removeChild(child);

        for (var d in dataSet) {
            var tr = createTag('tr',{},body);
            var td = createTag('td',{class:'firstCol'},tr);
            td.innerText = dataSet[d].ProjectName;
            createTag('td',{},tr).innerText = dataSet[d].DueDate.toDateString();
            createTag('td',{},tr).innerText = dataSet[d].Created.toDateString();
            createTag('td',{},tr).innerText = dataSet[d].Members;
            createTag('td',{},tr).innerText = getType(dataSet[d].Type);
            createTag('td',{},tr).innerText = getStatus(dataSet[d].Status);
            createTag('td',{},tr).innerText = dataSet[d].Customer;
        }
    };

    var subscribeHeader = function(){
      var headers = document.querySelectorAll('th');
      for (var index in headers) {
          var header = headers[index];
          header.addEventListener('click', sortColumn);
          header.setAttribute(DomStrings.dataColumnSortAttribute, SortingType.none);
      }
    };

    var removeSortIndicators = function(){
        var headers = document.querySelectorAll('th');
        for (var index = 0; index < headers.length; index++){
            var header = headers[index];
            var value = header.getAttribute(DomStrings.dataColumnSortAttribute);
            var current = +value;
            header.classList.remove(current === SortingType.asc ? 'sort_asc' : 'sort_desc');
        }

    }


    var sortColumn = function(event){
        console.log(event);

        var src = event.srcElement;

        if(!src){
            return;
        }
        var property = src.getAttribute(DomStrings.dataColumnPropertyAttribute);
        if(!property)
            return;

        var previous = +src.getAttribute(DomStrings.dataColumnSortAttribute);
        var current = SortingType.none;
        switch(previous){
            case SortingType.none:
                current = SortingType.asc;
                break;
            case SortingType.asc:
                current = SortingType.desc;
                break;
            case SortingType.desc:
                current = SortingType.asc;
                break;
        }
        removeSortIndicators();
        src.setAttribute(DomStrings.dataColumnSortAttribute,current);
        src.classList.remove(previous === SortingType.asc ? 'sort_asc' : 'sort_desc');
        src.classList.add(current === SortingType.asc ? 'sort_asc' : 'sort_desc');
        data.sort((a, b) => {
            if(a[property] > b[property])
                return current === SortingType.asc ? 1 : -1;
            if(a[property] < b[property])
                return current === SortingType.asc ? -1 : 1;
            return 0;
        });

        setData(data);


    };

    return {
        init: function(){
          initialPopulateData();
          subscribeHeader();
        },
    }


})();



tableController.init();

