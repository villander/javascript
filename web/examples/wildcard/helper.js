
function displayDifferences(url) {
    var PREFIX = "*-pnpres",
        regex = /^(.+subscribe\/[^\/]+\/)([^\/]+)(\/.+)$/i;

    if (url.indexOf(PREFIX) > 0) {
        (function () {
            var pnFirstUrl,
                matches,
                channels;

            matches = regex.exec(url);

            channels = decodeURIComponent(matches[2]).split(",");
            channels.sort(function (a, b) {
                if (a.indexOf(PREFIX) > 0) return -1;
                if (b.indexOf(PREFIX) > 0) return 1;
                return 0;
            });

            pnFirstUrl = url.replace(regex, function (matcher, p1, p2, p3) {
                return [p1, encodeURIComponent(channels.join(",")), p3].join("");
            });

            fetchResponse(url, pnFirstUrl);
        })()
    }
}

function fetchResponse(url, p) {
    $.get(url, function (data) {
        var html = '<div class="panel panel-success"><div class="panel-heading">' + url +
            '</div><div class="panel-body">' + data + '</div></div>';

        $.get(p, function (data) {
            $(".row").append(html + '<div class="panel panel-danger"><div class="panel-heading">' + p +
            '</div><div class="panel-body">' + data + '</div></div>');
        })
    })
}