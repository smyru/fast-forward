// Contains detected next URLs per tab ID
var next_urls = {};

chrome.extension.onMessage.addListener(
    function(req, sender, cb) {
        if (req.action == 'set-next')
        {
            if (req.value) {
                next_urls[sender.tab.id] = req.value;
            } else {
                delete next_urls[sender.tab.id];
            }
        }
        else if (req.action == 'load-next')
        {
            var next = next_urls[sender.tab.id];
            if (!next) {
                return;
            }
            chrome.tabs.update(
                sender.tab.id,
                { "url": combine_url(sender.tab.url, next) }
            );
        }
    }
);
function combine_url(root, plus) {
    var u = new URI(plus);
    var r = u.absoluteTo(root).toString();
    return r;
}
function clog(msg) {
    send_msg({"action": "log", "value": msg});
}
function send_msg(data, cb) {
    chrome.tabs.query(
        { active: true, currentWindow: true },
        function(tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                data,
                typeof cb === "function" ? cb : function(){}
            );
        }
    );
}
