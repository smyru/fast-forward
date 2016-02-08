// Note, even 'directly loaded' images seem to be actually
// loaded into an HTML imageholder, so that shall work for
// them as well
if (document instanceof HTMLDocument) {
    var interval = setTimeout(function() {
        set_next(detect());
        clearInterval(interval);
    }, 200);
    document.addEventListener('DOMContentLoaded', function() {
        set_next(detect());
        clearInterval(interval);
    });
    document.addEventListener('keydown', function(e) {
        if (e.keyCode !== 32 && e.keyCode !== 88)
            return;

        var el = e.target;

        if (el.nodeType == 3)
            el = el.parentNode;

        // Skip form inputs
        if (el.tagName == 'INPUT' || el.tagName == 'TEXTAREA')
            return;

        if ((e.keyCode === 88 && e.shiftKey)
        ||  (e.keyCode === 32 && at_bottom())) {
            load_next();
        }
    });

    function detect() {
        var url;
        if (url = find_rel_links())
            return url;
        url = find_semantic_links();
        return url;
    }
    function find_rel_links() {
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
    function find_semantic_links() {
        // FIXME keep markers in sep file?
        var markers = [
            ">>",
            "->",
            "=>",
            "-->",
            "==>",
            "»",
            // pl
            "^następna",
            "^następne",
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
            "starsze wpisy",
            "starsze posty",
            "older entr(y|ies)",
            "older post",
        ];
        var re = new RegExp(markers.join("|"), "i");

        // FIXME what about buttons?
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
    }
    function at_bottom() {
        return (document.body.scrollHeight <= document.body.scrollTop + window.innerHeight);
    }
    /* Messaging */
    function load_next() {
        send_msg({ action: 'load-next' });
    }
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
}
chrome.extension.onMessage.addListener(
    function(req, sender, sendResponse) {
        if (req.action == 'log') {
            clog(req.value);
        }
        else
            clog("Unhandled msg: "+JSON.stringify(req));
    }
);
function clog(val) {
    console.log(val);
}
