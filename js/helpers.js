String.prototype.trimRight = function(charlist) {
    if (charlist === undefined)
        charlist = "\s";

    return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

String.prototype.trimLeft = function(charlist) {
    if (charlist === undefined)
        charlist = "\s";

    return this.replace(new RegExp("^[" + charlist + "]+"), "");
};

function getAbsoluteUrl(baseUrl, url) {
    var pattern = /^https?:\/\//i;
    if (pattern.test(url)) {
        return url;
    }

    return baseUrl.trimRight('/') + '/' + url.trimLeft('/');
}

function getFixedUrl(url) {
	return "http://cors.io/?u=" + url;
}