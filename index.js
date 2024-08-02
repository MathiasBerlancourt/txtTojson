const fs = require('fs');

const date = new Date();

// Generate timestamp
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');

const timeStamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;

console.log("timestamp:", timeStamp);

fs.readFile(`data/in/Reporting-castleblack.txt`, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log("Raw data read from file:", data);

    const jsonData = "[" + data.trim().replace(/}\s*{/g, "},\n{") + "]";

    console.log("Modified JSON string:", jsonData);

    // Parse and re-stringify the JSON data to format it properly
    let parsedData;
    try {
        parsedData = JSON.parse(jsonData);
    } catch (parseErr) {
        console.error("Failed to parse JSON data:", parseErr.message);
        const position = parseErr.message.match(/at position (\d+)/);
        if (position) {
            const pos = parseInt(position[1], 10);
            console.error("Error around this part of the string:", jsonData.substring(pos - 50, pos + 50));
        }
        return;
    }

    const formattedJsonData = JSON.stringify(parsedData, null, 4); // 4 spaces for indentation

    fs.writeFile(`data/out/Reporting-castleblack_${timeStamp}.json`, formattedJsonData, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Json file created with success 🎉');
    });
});