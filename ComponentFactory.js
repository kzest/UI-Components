function ComponentFactory(componentName) {
    if (componentName.toLowerCase() === "gridcomponent") {
        var gridComponent = new GridComponent();
        gridComponent = gridComponent.CreateComponentWithAllItsParts();
        return gridComponent;
    }
    else if (componentName.toLowerCase() === "searchcomponent") {
        var searchComponent = new SearchComponent();
        searchComponent = searchComponent.CreateComponentWithAllItsParts();
        return searchComponent;
    }
}


function AbstractComponent() {
    var _componentFunctionalityParamsCollection = function () {
        var functionalitiesList = [];
        this.Push = function (gridFunctionalityParams) {
            functionalitiesList.push(gridFunctionalityParams);
        };

        this.Pop = function () {
            return functionalitiesList.pop();
        };

        this.ElementAt = function (index) {
            if (Number.isSafeInteger(index) == true && index >= 0)
                return functionalitiesList[index];
        };

        this.Length = function () {
            return functionalitiesList.length;
        };

        this.GetParamByKey = function (key) {
            let i = 0;
            let iCount = functionalitiesList.length;
            for (i = 0; i < iCount; i++) {
                if (functionalitiesList[i].Key === key) {
                    return functionalitiesList[i];
                }
            }
        };
    };
    
    this.SetXhrWorker = function () {
        this.ComponentController.Xhrworker = new Worker("/Scripts/Workers/XHRWorker.js");
    }

    this.MakeXhr = this.MakeXhr || function (httpverb, url, payload, successcallback, failurecallback) {
        var async = true;
        var d = new Date();
        var ticks = d.getTime();
        url = url.concat("?").concat(ticks.toString());

        var xhr = new XMLHttpRequest();
        xhr.open(httpverb, url, async);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
                var result = xhr.responseText.replace(String.fromCharCode(65279), "");
                if (successcallback instanceof Function)
                    successcallback(result);
            }
        }

        xhr.onerror = function (e) {
            console.log("Error during AJAX call- HttpVerb:" + httpverb + ", Url: " + url);
            if (failurecallback instanceof Function)
                failurecallback(e);
        }

        xhr.send(payload);
    }

    this.ComponentController = this.ComponentController || function () {
        this.FireUp = null;
    }

    this.ComponentFunctionalityParams = this.ComponentFunctionalityParams || null;
    this.SetParamsToController = function () {
        this.ComponentController.ComponentFunctionalityParams = this.ComponentFunctionalityParams;
    }

    this.ComponentFunctionalityParamsCollection = this.ComponentFunctionalityParamsCollection || null;
    this.SetParamsCollectionToController = function () {
        this.ComponentController.ComponentFunctionalityParamsCollection = new _componentFunctionalityParamsCollection();
    }

    this.CreateComponentWithAllItsParts = function () {
        AbstractComponent.call(this);
        this.ComponentController = this.ComponentController || {};
        this.SetXhrWorker();
        this.SetParamsToController();
        this.SetParamsCollectionToController();        
        return this.ComponentController;
    }
}