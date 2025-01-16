const fs = require('fs');
const path = require('path');


function deleteFile(filePath) {
    if (!filePath) {
        return;
    }

    const fullPath = path.join(__dirname, '..', filePath);

    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${fullPath}`);
        } else {
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${fullPath}`, err);
                } else {
                    console.log(`File deleted: ${fullPath}`);
                }
            });
        }
    });
}


module.exports = {
    deleteFile
};