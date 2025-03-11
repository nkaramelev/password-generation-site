function copyToClipboard() {
    const passwordField = document.getElementById('password');
    navigator.clipboard.writeText(passwordField.value)
}

function generatePassword() {
    const lengthField = document.getElementById('password-length');
    const passwordField = document.getElementById('password');
    let length = parseInt(lengthField.value, 10);

    if (!length || length < 1) {
        length = 1;
    } else if (length > 1000) {
        length = 1000;
    }
    lengthField.value = length;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_$#@%';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    passwordField.value = password;
}

let fileHandle = null; 

async function downloadPassword() {
    const serviceName = document.getElementById('service-name').value.trim();
    const password = document.getElementById('password').value;

    if (!serviceName) {
        alert("Enter name of the service!");
        return;
    }
    if (!password) {
        alert("No password to save!");
        return;
    }

    const timestamp = getOmskTime();
    const newEntry = `Service name: ${serviceName}\nPassword: ${password}\nDate: ${timestamp}\n\n`;

    if (!fileHandle) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: "passwords.txt",
                types: [{
                    description: "Text file",
                    accept: { "text/plain": [".txt"] }
                }]
            });

            fileHandle = handle;
        } catch (err) {
            console.error("Error while selecting a file:", err);
            return;
        }
    }

    try {
        const file = await fileHandle.getFile();
        const existingContent = await file.text();

        const updatedContent = existingContent + newEntry;

        const writable = await fileHandle.createWritable();
        await writable.write(updatedContent);
        await writable.close();

    } catch (err) {
        console.error("Error while writing to the file:", err);
    }
}

function getOmskTime() {
    const now = new Date();
    const options = {
        timeZone: "Asia/Omsk",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    };
    return new Intl.DateTimeFormat("ru-RU", options).format(now).replace(",", " |");
}