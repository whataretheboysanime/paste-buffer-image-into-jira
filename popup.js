var inputDomain = document.querySelector("#inputDomain");
var buttonOn = document.querySelector("#on");
var buttonOff = document.querySelector("#off");
var save = document.querySelector("#save");

function init() {
    chrome.storage.local.get(["domain"]).then((result) => {
        console.log("Result for 'domain' is " + JSON.stringify(result));

        if(result["domain"] != undefined) 
            inputDomain.value = result["domain"];
    });

    chrome.storage.local.get(["is execute"]).then((result) => {
        console.log("Result for 'is execute' is " + JSON.stringify(result));

        if(result["is execute"] != undefined) 
            initIsExecute(result["is execute"]);
        else {
            chrome.storage.local.set({ 'is execute': 'false' }).then(() => {
                console.log("Value 'is execute' is set");
            });
            initIsExecute('false');
        }
    });
}

function initIsExecute(value) {
    let isExecute = strToBool(value);

    if(isExecute)
        onSelect();
    else
        offSelect();
}

let strToBool = (value) => value == 'true';

$('input[name=options]').change(function() {
    let id = $('input[name=options]:checked')[0].id;

    if(id == 'on') {
        chrome.storage.local.set({ 'is execute': 'true' }).then(() => {
            console.log("Value 'is execute' is set");
        });
        onSelect();
    } else {
        chrome.storage.local.set({ 'is execute': 'false' }).then(() => {
            console.log("Value 'is execute' is set");
        });
        offSelect();
    }
});

function onSelect() {
    buttonOn.checked = true;
    buttonOff.checked = false;

    buttonOff.parentElement.classList.remove('active');
    buttonOn.parentElement.classList.add('active');

    buttonOn.parentElement.style.backgroundColor = "green";
    buttonOff.parentElement.style.backgroundColor = "";
}

function offSelect() {
    buttonOn.checked = false;
    buttonOff.checked = true;

    buttonOn.parentElement.classList.remove('active');
    buttonOff.parentElement.classList.add('active');

    buttonOff.parentElement.style.backgroundColor = "red";
    buttonOn.parentElement.style.backgroundColor = "";
}

save.onclick = function () {
    window.localStorage['domain'] = inputDomain.value;
    chrome.storage.local.set({ 'domain': inputDomain.value }).then(() => {
        console.log("Value 'is execute' is set");
    });
}

init();