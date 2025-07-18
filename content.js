chrome.runtime.sendMessage("Empty");

chrome.runtime.onMessage.addListener(async function(message) {
    if(!!message.isExecute && !!message.domain && window.location.href.indexOf(`${message.domain}/browse`) > -1) {
        switch(message.type) {
            case "Empty":
                createObserverForPasteButton()
                break;
            case "Clipboard":
                await clipboardPasteEvent();
                break;
        }
    }
});

function createObserverForPasteButton() {
    var observer = new MutationObserver(function(mutation, observer) {
        let attachmentDialog = document.querySelector("#attach-file-dialog");
        if(!!attachmentDialog) {
            var observerAttachmentDialog = new MutationObserver(function(mutation, observer) {
                let fileButton = document.querySelector(".upfile");
                let clipboardButton = document.querySelector("#tempFilenameClipboard");

                if(!!fileButton && !clipboardButton)
                    createPasteButton();
            });
            observerAttachmentDialog.observe(attachmentDialog, {
                'childList': true
            });
        }
    });
    observer.observe(document.body, {
        'childList': true
    });
}

async function clipboardPasteEvent() {
    let clipboardItems = await getClipboardContent();
    let data = clipboardItems[0];

    let currentDatetime = getCurrentDatetime();
    let filename = 'Clipboard ' + currentDatetime + '.' + data.types[0].split('/')[1];

    let file = await datatoFile(data, filename, data.types[0]);//dataURLtoFile(data.content,filename);

    const dt = new _DataTransfer();
    dt.items.add(file);
    let upfile = document.querySelector('input[name=tempFilename]');
    if (dt.files.length)
        upfile.files = dt.files;

    let ajaxpresent = new AJS.InlineAttach.AjaxPresenter(AJS.$(upfile));
    ajaxpresent._uploadFiles([
        {file: upfile.files[0], name: upfile.files[0].name, size: upfile.files[0].size}
    ]);
}

class _DataTransfer {
    constructor() {
      return new ClipboardEvent("").clipboardData || new DataTransfer();
    }
}

async function getClipboardContent() {
    try {
        return await navigator.clipboard.read();
    } catch (error) {
        console.error('Ошибка при чтении буфера обмена:', error);
        return '';
    }
}

function getCurrentDatetime() {
    let now = new Date(),
        year = now.getYear() + 1900,
        month = now.getMonth() + 1 + '',
        day = now.getDate() + '',
        hours = now.getHours() + '',
        minutes = now.getMinutes() + '',
        seconds = now.getSeconds() + '',
        milliseconds = now.getUTCMilliseconds();

    if(month.length == 1)
        month = '0' + month;

    if(day.length == 1)
        day = '0' + day;

    if(hours.length == 1)
        hours = '0' + hours;

    if(minutes.length == 1)
        minutes = '0' + minutes;

    if(seconds.length == 1)
        seconds = '0' + seconds;

    return year + '-' + month + '-' + day + '_' +
        + hours + '-' + minutes + '-' + seconds;
}

function htmlImgToObj(input) {
    let type = null;
    let content = null;
    let matchedText = input.match(/src="[^\s]*"/);

    if(matchedText.length > 0) {
        let data = matchedText[0];

        let indexOfColon = data.indexOf(":");
        let indexOfSemicolon = data.indexOf(";");

        if(indexOfColon > -1 && indexOfSemicolon > -1)
            type = data.slice(indexOfColon + 1, indexOfSemicolon);

        let splitedData = data.split('"');
        if(splitedData.length == 3)
            content = splitedData[1];
    }

    return {type: type, content: content};
}

async function datatoFile(data, filename, mime) {       
    const blob = await data.getType(mime);
    
    return new File([blob], filename, {type:mime});
}

function createPasteButton() {
    let button = document.createElement('input');
    button.setAttribute("class", "upfile");
    button.setAttribute("id", "tempFilenameClipboard");
    button.setAttribute("type", "button");
    button.setAttribute("value", "Вставить изображение из буфера");

    button.onclick = paste;

    let fileButton = document.querySelector(".upfile");
    let container = fileButton.parentElement;
    container.insertBefore(button, fileButton);
}

function paste() {
    let textarea = document.createElement("textarea");
    textarea.contentEditable = true;
    textarea.id = 'clipboardText';
    document.querySelector("#issue-comment-add > div.field-group.comment-input").append(textarea);
    chrome.runtime.sendMessage("Clipboard");
}