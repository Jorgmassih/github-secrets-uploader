let submitType;
let quill;

function onFileUploaded() {
    submitType = 'file';

    // Hide the other options
    document.getElementById('divider').classList.add('d-none');
    document.getElementById('textAreaButton').classList.add('d-none');

    // Enable the submit and clear button
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('clearBtn').disabled = false;

}

function onTextAreaClicked() {
    submitType = 'text';

    // Hide the other options
    document.getElementById('divider').classList.add('d-none');
    document.getElementById('formFile').classList.add('d-none');

    // Enable the submit and clear button
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('clearBtn').disabled = false;

    // Show the textarea box
    document.getElementById('config-textarea-box').classList.remove('d-none');

    // Focus textarea
    quill.enable(true);
    quill.focus();
}

// Clear the form
function clearForm() {
    // Clear all inputs
    document.getElementById('formFile').value = '';
    disableTextArea();
    document.getElementById('repoName').value = '';
    document.getElementById('ownerName').value = '';
    document.getElementById('token').value = '';
    document.getElementById('workflowResult').value = '';

    // Hide textarea box
    document.getElementById('config-textarea-box').classList.add('d-none');
    // Show the other options
    document.getElementById('divider').classList.remove('d-none');
    document.getElementById('textAreaButton').classList.remove('d-none');
    document.getElementById('formFile').classList.remove('d-none');

    // Disable the submit and clear button
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('clearBtn').disabled = true;

    // Hide the result textarea
    document.getElementById('workflowResultBox').classList.add('d-none');
}

function login() {
   // Get Github App Client ID
    let xhr = new XMLHttpRequest();
    xhr.open('get', '/github-client-id');
    xhr.send();
    xhr.onload = function () {
        if (xhr.status === 200) {
            let clientId = JSON.parse(xhr.response)['clientId'];
            window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}`;    
        }
    }
}

// Submit
function submit() {
    let file = document.getElementById('formFile').files[0];
    let formData = new FormData();

    if (submitType === 'file') {
        formData.append('file', file);
    } else {
        formData.append('text_area', quill.getText());
    }
    formData.append('repo_name', document.getElementById('repoName').value);
    formData.append('github_token', document.getElementById('token').value);
    formData.append('repo_owner', document.getElementById('ownerName').value);


    let xhr = new XMLHttpRequest();
    xhr.open('POST', `/submit/${submitType}`);
    xhr.send(formData);
    xhr.onload = function () {
        if (xhr.status == 200) {
            console.log('File sent');
            let res = JSON.parse(xhr.response);
            document.getElementById('workflowResult').value = res['ci_tasks'];
            document.getElementById('workflowResultBox').classList.remove('d-none');
            // hide all excep method buttons
            document.getElementById('methodsBox').classList.add('d-none');

            // add copy button inside textarea
            let copyBtn = document.createElement('button');
            copyBtn.classList.add('btn', 'btn-outline-secundary', 'btn-sm', 'btn-block');
            copyBtn.innerHTML = 'Copy';
            copyBtn.onclick = function () {
                copyToClipboard(document.getElementById('workflowResult').value);
            }
            document.getElementById('workflowResultBox').appendChild(copyBtn);

        }
        else {
            console.log('Error: ' + xhr.status);
        }
    }

}

// Utils functions
function onLoad() {
    // Initialize Quill Text Editor
    quill = new Quill('#config-textarea', {
        modules: {
            toolbar: null
        },
        theme: 'snow' // or 'bubble'
    });

    
}

function disableTextArea() {
    // Deletes the content of the textarea and disable it
    if (quill.hasFocus()) {
        quill.blur();
    }
    quill.disable();
    quill.deleteText(0, quill.getLength());
    // Hide textarea box
    document.getElementById('config-textarea-box').classList.add('d-none');

}
