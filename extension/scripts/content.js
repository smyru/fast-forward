// Note, even 'directly loaded' images seem to be actually
// loaded into an HTML imageholder, so that shall work for
// them as well
if (document instanceof HTMLDocument) {
    var interval = setTimeout(function() {
        set_next(detect());
        clearTimeout(interval);
    }, 200);
    document.addEventListener('DOMContentLoaded', function() {
        set_next(detect());
        clearTimeout(interval);
    });
    document.addEventListener('keydown', function(e) {
        on_keydown(e);
    });
}
chrome.extension.onMessage.addListener(
    function(req, sender, sendResponse) {
        if (req.action == 'log') {
            clog(req.value);
        } else {
            clog("Unhandled msg: "+JSON.stringify(req));
        }
    }
);
function on_keydown(e) {
    if (e.code !== "Space" && e.code !== "KeyX")
        return;

    var el = e.target;

    // Skip TEXT_NODE
    if (el.nodeType == 3)
        el = el.parentNode;

    // Skip form inputs
    if (el.tagName == 'INPUT' || el.tagName == 'TEXTAREA')
        return;

    if ((e.code === "KeyX" && e.shiftKey)
    ||  (e.code === "Space" && at_bottom())) {
        send_msg({ action: 'load-next' });
    }
}
function detect() {
    var url;
    // First detect semantic rel tag, assume webmasters know
    // what they are doing.
    if (url = find_rel_link())
        return url;
    // Guess mode
    url = find_semantic_link();
    return url;
}
function find_rel_link() {
    var tags = [ "link", "a", ];
    var relations = [ "next", "index", "up", "top" ];

    for (var i in tags) {
        var t = tags[i];
        for (var j in relations) {
            var r = relations[j];
            var cand = document.querySelector(t+'[rel="'+r+'"]');
            if (! cand)
                continue;

            var url = cand.getAttribute("href");
            if (url == "")
                continue;

            return url;
        }
    }
}
function find_semantic_link() {
    // FIXME keep markers in sep file?
    var markers = [
        ">>",
        "->",
        "=>",
        "-->",
        "==>",
        "»",
        // pl
        "^następn",
        // en
        "^next",
        // cat
        "pròxim",
        "següent",
        // cz
        "další",
        // es
        "siguiente",
        "próxima",
        // pt
        "próximo",
        "seguinte",
        // ru
        "следующая",
        // ua
        "наступн",
        // FIXME potentially move to separate group?
        // more localization
        "starsze wpisy",
        "starsze posty",
        "older entr(y|ies)",
        "older post",
        "plus anciens",
    ];
    var re = new RegExp(markers.join("|"), "i");

    var links = document.links;
    for (var i = 0, j = links.length; i < j; i++) {
        var lnk = links[i];
        if (re.test(lnk.textContent)) {
            return lnk.href;
        }
        if (lnk["title"] && re.test(lnk["title"])) {
            return lnk.href;
        }
        // FIXME only the first link is returned
    }
    // FIXME buttons?
    // They break current model of interaction. Likely
    // need event firing instead of plain URL capture and
    // loading on user request.
}
function at_bottom() {
    return (document.body.scrollHeight <= document.body.scrollTop + window.innerHeight);
}
/* Messaging */
function set_next(url) {
    if (!url || url == "")
        send_msg({ action: 'set-next', value: undefined });
    else
        send_msg({ action: 'set-next', value: url });
}
function send_msg(data, cb) {
    chrome.extension.sendMessage(
        data,
        typeof cb === "function" ? cb : function(){}
    );
}
function clog(val) {
    console.log(val);
}
