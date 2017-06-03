class EventPage {
    constructor() {
        let self = this;
        let isCompatible = self.checkBrowserCompatibility();
        chrome.browserAction.onClicked.addListener((tab) => {
            if (isCompatible) {
                chrome.tabs.executeScript(tab.id, {
                    file: "getImg.js"
                });
            }
            else {
                alert("Browser version not supported, please consider upgrading your browser.");
            }
        });
    }
    checkBrowserCompatibility() {
        let nVer = navigator.appVersion, nAgt = navigator.userAgent, browserName = navigator.appName, fullVersion = '' + parseFloat(navigator.appVersion), majorVersion = parseInt(navigator.appVersion, 10), nameOffset, verOffset, ix;
        if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            browserName = "Chrome";
            fullVersion = nAgt.substring(verOffset + 7);
        }
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
            (verOffset = nAgt.lastIndexOf('/'))) {
            browserName = nAgt.substring(nameOffset, verOffset);
            fullVersion = nAgt.substring(verOffset + 1);
            if (browserName.toLowerCase() == browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }
        if ((ix = fullVersion.indexOf(";")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        if ((ix = fullVersion.indexOf(" ")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        majorVersion = parseInt('' + fullVersion, 10);
        if (isNaN(majorVersion)) {
            fullVersion = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }
        if (browserName.indexOf('Chrome') >= 0)
            return (majorVersion >= 42);
    }
}
var evtPage = new EventPage();
//# sourceMappingURL=eventPage.js.map