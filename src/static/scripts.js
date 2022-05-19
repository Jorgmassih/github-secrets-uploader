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

// Submit
function submit() {
    // Set Loadding Status
    setStatusButton(false, 'clearBtn'); 
    setLoadingButton(true, 'submitBtn');

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

            // Set modal content text
            document.getElementById('workflow-step-modal-textarea').value = res.ciStep;

            // Add on click event to the button
            document.getElementById('workflow-setp-modal-save').onclick = function () {
                navigator.clipboard.writeText(res.ciStep);
            };

            // Show modal
            let worklowStep = new bootstrap.Modal(document.getElementById('workflow-step-modal'))
            worklowStep.show();

        }
        else {
            console.log('Error: ' + xhr.status);
        }
        // Unset Loadding Status
        setStatusButton(true, 'clearBtn');
        setLoadingButton(false, 'submitBtn');
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

    // Set onclick event to the buttons
    document.getElementById('submitBtn').onclick = function () {submit();};
    document.getElementById('clearBtn').onclick = function () {clearForm();};
    document.getElementById('textAreaButton').onclick = function () {onTextAreaClicked();};
    
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

function setStatusButton(desiredStatus, buttonId){
    if(!desiredStatus){    
        document.getElementById(buttonId).disabled = true;
        return;
    }
    document.getElementById(buttonId).disabled = false;
}

function setLoadingButton(status, buttonId){
    if (!status){
        // Remove child only if it is a span so it doesn't show the loading animation
       for (let i = 0; i < document.getElementById(buttonId).childNodes.length; i++){
           if (document.getElementById(buttonId).childNodes[i].nodeName === 'SPAN'){
               document.getElementById(buttonId).removeChild(document.getElementById(buttonId).childNodes[i]);
           }
       }
       setStatusButton(true, buttonId);
       return;
    }

    //add chlid span
    let span = document.createElement('span');
    span.classList.add('spinner-border', 'spinner-border-sm');

    // disable button
    setStatusButton(false, buttonId);
    
    span.setAttribute('role', 'status');
    span.setAttribute('aria-hidden', 'true');
    span.style.marginRight = '7px'
    document.getElementById(buttonId).prepend(span);
}

function throwToast(message='hello') {
    let toastWrapper = document.getElementById('toast-wrapper');
    // let toast_template = `<div class="toast align-items-center text-bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
    //     <div class="d-flex">
    //         <div class="toast-body">
    //             ${message}
    //         </div>
    //         <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    //     </div>
    // </div>`;
    
    let toast_template = `<!-- Then put toasts within -->
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <img src="..." class="rounded me-2" alt="...">
        <strong class="me-auto">Bootstrap</strong>
        <small class="text-muted">just now</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        See? Just like this.
      </div>
    </div>` 
    toastWrapper.innerHTML += toast_template; 

    console.log(toastWrapper.innerHTML);
    toast = new bootstrap.Toast(toastWrapper.lastChild);
    toast.show();
}