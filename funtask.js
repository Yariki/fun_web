

var Type = {
    none: -1,
    web: 0,
    desctop: 1,
    mobile: 2,
    support: 3
};

var Customers = {
    first: 'Microsoft',
    second: 'AMD',
    third: 'NVidia',
    fourth: 'Oracle'
}

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

var IndexRepository = (function(){
    var index = 0;

    var getNextIndex = function () {
        return ++index;
    };

    return {
        getNextIndex: function(){
            return getNextIndex();
        }
    }
})();


var Project = function (id, projectName, dueDate, created, members, type, status, customer) {
    this.Id = id;
    this.ProjectName = projectName;
    this.DueDate = dueDate;
    this.Created = created;
    this.Members = members;
    this.Type = type;
    this.Status = status;
    this.Customer = customer;

};

var DomStrings = {
    tableBody: "tableBody",
    table: "table",
    dataColumnSortAttribute: 'data-column-sort',
    dataColumnPropertyAttribute: 'data-property',
    dataColumnDeleteAttrubute: 'data-delete-record',
    dataColumnIdAttribute: 'data-id'
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


function openRightMenu() {
    var right = document.getElementById('rightSideMenu');
    right.style.width = '350px';
}

function closeRightMenu() {
    var right = document.getElementById('rightSideMenu');
    right.style.width = '0px';
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

function populateSelects() {
    var types = document.getElementById("types");
    if(types !== 'undefined' || types != null){

        for (var type in Type) {
            var option = createTag('option',{},types);
            option.value = Type[type];
            option.text = type;
        }
    }
    types.value = null;

    var customers = document.getElementById('customers');
    if(customers){
        for (var prop in Customers) {
            var option = createTag('option',{},customers);
            option.text = option.value = Customers[prop];
        }
    }
    customers.value = null;
    var createButton = document.querySelector('#btnCreate');
    if(createButton){
        createButton.disabled = true;
    }
}

var messageController = (function () {
    var modalLayer;
    var messageTag ;
    var buttonOk ;
    var buttonCancel ;
    var internalOkCallback = null;
    var internalCancelCallback = null;


    function setup(){
        modalLayer = document.getElementById("modalLayer");
        messageTag = document.getElementById("message");
        buttonOk = document.getElementById("btnOk");
        buttonCancel = document.getElementById("btnCancel");
        internalOkCallback = null;
        internalCancelCallback = null;

        buttonOk.addEventListener('click',function(event){
            if(internalOkCallback){
                internalOkCallback();
            }
            closeModal();
        });

        buttonCancel.addEventListener('click', function (event) {
            if(internalCancelCallback){
                internalCancelCallback();
            }
            closeModal();
        });

    }


    var showMessage = function () {
        modalLayer.style.display = 'block';
    };

    var closeModal = function () {
        modalLayer.style.display = 'none';
        internalOkCallback = internalCancelCallback = null;
    };

    var setMessage = function (message){
        messageTag.innerText = message;
    };
    
    var setCallbacks = function (okCallback, cancelCallback) {
        internalOkCallback = okCallback;
        internalCancelCallback = cancelCallback;
    };


    return {
        showMessage: function(message, okCallback, cancelCallback){
            setCallbacks(okCallback,cancelCallback);
            setMessage(message);
            showMessage();
        },
        init: function(){
            setup();
        }
    }
})();

var dataController =  (function(){

    var dataUpcatedCallback = null;

    var data = [
        new Project(IndexRepository.getNextIndex(), 'PCo', new Date(2019,12,2), new Date(2005,12,6),null,Type.desctop, Status.none, 'SAP'),
        new Project(IndexRepository.getNextIndex(),'WebSped', new Date(2017,12,15), new Date(2017,12,15),null,Type.mobile, Status.completed, 'LIS'),
        new Project(IndexRepository.getNextIndex(),'Outlookfinder', new Date(2017,10,12), new Date(2017,10,12),null,Type.support, Status.inProgress, 'Vincent Payette'),
        new Project(IndexRepository.getNextIndex(),'Windows', new Date(1989,10,12), new Date(2020,12,31),null,Type.web, Status.new, 'Microsoft'),
        new Project(IndexRepository.getNextIndex(),'Linux', new Date(1991,10,12), new Date(2020,12,31),null,Type.desctop, Status.inProgress, 'Torvalds')
    ];


    var internalAddItem = function (item) {
        data.push(item);
        if(dataUpcatedCallback !== undefined && dataUpcatedCallback !== null){
            dataUpcatedCallback();
        }
    };

    var internalDeleteItem = function (item) {
        var index = data.indexOf(item);
        data.splice(index,1);
    };

    var internalFindById = function (id) {
        return data.find(i => i.Id == id);
    };



    return {
        addItem: function(item){
            internalAddItem(item);
        },

        deleteItem: function (item) {
            internalDeleteItem(item);
        },
        findItemById: function (id) {
            return internalFindById(id);
        },
        getData: function () {
            return data.slice(0);
        },
        subscribeDataUpdate: function (callback) {
            dataUpcatedCallback = callback;
        }

    };

})();


var projectUiControler = (function(dataController){


    var controls = {
        projectName: null,
        dueDate: null,
        createdDate:  null,
        members: null,
        types: null,
        customers: null
    }
    var createButton = null;
    var filterDate = null;

    var setupEventListeners = function(){
        controls.projectName = document.querySelector('#projectName');
        if(controls.projectName){
            controls.projectName.addEventListener('change',validate)
        }
        controls.dueDate = document.querySelector('#dueDate');
        if(controls.dueDate){
            $(controls.dueDate).datepicker();
            controls.dueDate.addEventListener('change',validate);
        }

        controls.createdDate = document.querySelector("#createdDate");
        if(controls.createdDate){
            $(controls.createdDate).datepicker();
            controls.createdDate.addEventListener('change',validate);
        }

        filterDate = document.querySelector("#filterDateValue");
        $(filterDate).datepicker();


        controls.members = document.querySelector('#members');
        if(controls.members){
            controls.members.addEventListener('change',validate);
        }
        controls.types = document.querySelector('#types');
        if(controls.types){
            controls.types.addEventListener('change',validate);
        }
        controls.customers = document.querySelector('#customers');
        if(controls.customers){
            controls.customers.addEventListener('change',validate);
        }
        createButton = document.querySelector('#btnCreate');
        if(createButton){
            createButton.addEventListener('click',createNewProject);
        }
    };


    var validate = function(evt){
        var valid = true;
        for (var prop in controls){

            if(prop == 'dueDate' || prop == 'createdDate'){
                continue;
            }
            var ctrl = controls[prop];
            valid = ctrl && ctrl.value != null && ctrl.value != undefined && ctrl.value != '';
            if(!valid)
                break;
        }

        var date1 = validateDates(controls.dueDate);
        var date2 =  validateDates(controls.createdDate);

        createButton.disabled = !valid || !date1 || !date2;
    };

    var validateDates = function(picker){

        var reg = /^\d{2}\-\d{2}\-\d{4}$/
        var value1 = picker.value;
        var validDate1 = value1.match(reg);
        return validDate1 != null && validDate1.length == 1;
    };


    var createNewProject = function () {
        var dueDate = controls.dueDate.value.split("-");
        var createdDate = controls.createdDate.value.split("-");
        dataController.addItem(new Project(IndexRepository.getNextIndex(),controls.projectName.value,  new Date(+dueDate[0],+dueDate[1],+dueDate[2]), new Date(+createdDate[0],+createdDate[1],+createdDate[2]),controls.members.value, controls.types.value, Status.inProgress, controls.customers.value));
        resetValues();
    };

    var resetValues = function(){
        controls.projectName.value = '';
        controls.dueDate.value = '';
        controls.createdDate.value = '';
        controls.members.value = '';
        controls.types.value = '';
        controls.customers.value = '';
        createButton.disabled = true;
    };


    return {
        init: function () {
            setupEventListeners();
        },
    }


})(dataController);



var tableController = (function(messageController,dataController){



    var initialPopulateData = function(){
        setData(dataController.getData());
    };

    dataController.subscribeDataUpdate(initialPopulateData);

     var removeTableData = function(body) {
         processDeleteSubscribtion(body,true);
        var child;
        while (child = body.firstChild)
            body.removeChild(child);
    };

    var onDeleteItem = function (event) {

        var id = +this.getAttribute(DomStrings.dataColumnIdAttribute);
        var item = dataController.findItemById(id);

        messageController.showMessage("Are you sure you want to delete record with Project Name '"+ item.ProjectName +"'?",function(){

            dataController.deleteItem(item);

            var rowToRemove = document.querySelector("tr["+DomStrings.dataColumnIdAttribute +"='"+ id +"']");
            if(rowToRemove){
                    var parent = rowToRemove.parentNode;
                    if(parent){
                        parent.removeChild(rowToRemove);
                    }
            }
        },
            null);
    };

    var processDeleteSubscribtion = function (body, isDeleteSubscription) {
        var links = body.querySelectorAll('['+ DomStrings.dataColumnDeleteAttrubute +']');
        for(var i = 0; i < links.length; i++){
            var link = links[i];
            if(isDeleteSubscription){
                link.removeEventListener('click',onDeleteItem);
            }else{
                link.addEventListener('click',onDeleteItem);
            }
        }
    };


    var setData = function(dataSet) {
        var body = document.getElementById(DomStrings.tableBody);

        removeTableData(body);

        for (var d in dataSet) {
            var isFinished = dataSet[d].Created.getTime() == dataSet[d].DueDate.getTime();
            var tr = createTag('tr', isFinished ? {class: 'finished'} : {},body);
            tr.setAttribute(DomStrings.dataColumnIdAttribute, dataSet[d].Id);
            createTag('td', isFinished ? {} : {class:'firstCol'},tr).innerText = dataSet[d].ProjectName;
            createTag('td',{},tr).innerText = dataSet[d].DueDate.toDateString();
            createTag('td',{},tr).innerText = dataSet[d].Created.toDateString();
            createTag('td',{},tr).innerText = dataSet[d].Members;
            createTag('td',{},tr).innerText = getType(dataSet[d].Type);
            createTag('td',{},tr).innerText = getStatus(dataSet[d].Status);
            createTag('td',{},tr).innerText = dataSet[d].Customer;
            createTag('td',{},tr).innerHTML = '<a href="#" data-delete-record data-id="'+ dataSet[d].Id +'"><i class="fa fa-trash"></i></a>';
        }

        processDeleteSubscribtion(body,false);
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
        var data = dataController.getData();
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


})(messageController,dataController);



window.addEventListener('DOMContentLoaded', function(){
    messageController.init();
    projectUiControler.init();
    populateSelects();
    tableController.init();
});
