function SearchComponent() {
    AbstractComponent.call(this);

    var _componentController = function () {
        AbstractComponent.call(this);
        this.FireUp = function (functionalityKey, payLoad) {
            let i = 0;
            let iCount = this.ComponentFunctionalityParamsCollection.Length();
            for (i = 0; i < iCount; i++) {
                let cfp = this.ComponentFunctionalityParamsCollection.ElementAt(i);
                let key = cfp.Key;
                if (functionalityKey.toLowerCase() == key.toLowerCase()) {
                    cfp.Payload = payLoad;
                    if (cfp.ResultsComponent != null) {
                        var resultsfp = cfp.ResultsComponent.ComponentFunctionalityParamsCollection.GetParamByKey(cfp.ResultsParamKey);
                        if (resultsfp != null) {
                            resultsfp.Payload = cfp.Payload;
                            resultsfp.InitializeSuccessCallback = function (e) {
                                if (cfp.InitializeSuccessCallback instanceof Function)
                                    cfp.InitializeSuccessCallback(e);
                            }

                            resultsfp.InitializeFailureCallback = function (e) {
                                if (cfp.InitializeFailureCallback instanceof Function)
                                    cfp.InitializeFailureCallback(e);
                            }

                            cfp.ResultsComponent.FireUp(cfp.ResultsParamKey, payLoad);
                        }
                        else { throw ("Results Functionality Param for 'Search' not found!");}
                    }
                    else {
                        throw ("Results Component not found!");
                    }

                    break;
                }
            }
        }
    };


    this.ComponentFunctionalityParams = function () {
        this.Key = "";
        this.ResultsComponent = null;
        this.ResultsParamKey = "";
        this.Payload = {};
        this.DataRowProcessorCallback = null;
        this.InitializeSuccessCallback = null;
        this.InitializeFailureCallback = null;
    }

    this.ComponentController = new _componentController();

    this.CreateComponentWithAllItsParts = function () {
        AbstractComponent.call(this);
        this.ComponentController = this.ComponentController || {};
        this.SetParamsToController();
        this.SetParamsCollectionToController();
        return this.ComponentController;
    }
}