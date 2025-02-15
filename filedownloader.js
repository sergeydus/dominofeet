const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const path = 'lvls/split'
for (let i = 0; i <= 54; i++) {
    const filename = `${i}.json`
    const file = fs.createWriteStream(`${path}/${filename}`);
    const request = http.get(`https://dominofit.isotropic.us/lvls/split/${i}.json`, function (response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            console.log("Download Completed");
        });
    });
}