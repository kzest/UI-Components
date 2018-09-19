this.onmessage = function (e) {
    var httpverb = e.data[0];
    var url = e.data[1];
    var payload = e.data[2];
    var token = e.data[3]
    var async = true;

    var d = new Date();
    var ticks = d.getTime();
    url = url.concat("?").concat(ticks.toString());

    var xhr = new XMLHttpRequest();
    xhr.open(httpverb, url, async);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
            var result = xhr.responseText.replace(String.fromCharCode(65279), "");
            postMessage(result);
        }
        else if (xhr.readyState == 4 && xhr.status > 300) {
            console.log("Error during AJAX call- HttpVerb:" + httpverb + ", Url: " + url + ", status code: " + xhr.status.toString());
            postMessage("error occurred");
        }
    }

    xhr.onerror = function(e) {
        console.log("Error during AJAX call- HttpVerb:" + httpverb + ", Url: " + url);
        postMessage("error occurred");
    }

    xhr.setRequestHeader("Content-Type", "application/json");
    //xhr.setRequestHeader("");
    xhr.send(payload);
}