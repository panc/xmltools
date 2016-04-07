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

Array.prototype.remove = function(item) { 
    this.splice(this.indexOf(item) == -1 
        ? this.length 
        : this.indexOf(item), 1); 
}

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