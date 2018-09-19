function GridComponent() {
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
                    if (this.Xhrworker != null) {
                        this.Xhrworker.onmessage = function (e) {
                            if (e.data == "error occurred") {
                                cfp.InitializeFailureCallback();
                            }
                            else {
                                cfp.RawData = JSON.parse(e.data);
                                if (Array.isArray(cfp.RawData)) {
                                    let rawCount = cfp.RawData.length;
                                    if (rawCount > 0) {
                                        cfp.ProcessedObservableArray.removeAll();
                                        let iRaw = 0;
                                        for (iRaw = 0; iRaw < rawCount; iRaw++) {
                                            if (cfp.DataRowProcessorCallback instanceof Function) {
                                                let processedRow = cfp.DataRowProcessorCallback(cfp.RawData[iRaw]);
                                                cfp.ProcessedObservableArray.push(processedRow);
                                            }
                                            else {
                                                cfp.ProcessedObservableArray.push(cfp.RawData[iRaw]);
                                            }
                                        }
                                    }
                                }

                                if (cfp.InitializeSuccessCallback instanceof Function) {
                                    cfp.InitializeSuccessCallback(cfp.RawData);
                                }
                            }
                        }
                        this.Xhrworker.postMessage([cfp.HttpVerb, cfp.Url, JSON.stringify(cfp.Payload)]);
                    }
                    else {
                        this.MakeXhr(cfp.HttpVerb, cfp.Url, cfp.Payload, cfp.InitializeSuccessCallback, cfp.InitializeFailureCallback);
                    }

                    break;
                }
            }
        }
    };

    this.ComponentFunctionalityParams = function () {
        this.Key = "";
        this.HttpVerb = "";
        this.Url = "";
        this.Payload = {};
        this.RawData = [];
        this.ProcessedObservableArray = new ko.observableArray();
        this.DataRowProcessorCallback = null;
        this.InitializeSuccessCallback = null;
        this.InitializeFailureCallback = null;
    }
    
    this.ComponentController = new _componentController();
};