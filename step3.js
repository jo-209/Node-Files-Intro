const fs = require('fs');
const process = require('process');
const axios = require('axios');

//Handle Output - Write to file if out flag is present, otherwise print to console.
function handleOutput(text, out) {
  if (out) {
    fs.writeFile(out, text, 'utf8', function(err) {
      if (err) {
        console.error(`Error writing to ${out}: ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(text);
  }
}

//Reads the file path and prints it to the console.

function cat(filePath, out) {
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      console.error(`Error reading ${filePath}: ${err}`); 
      process.exit(1);
    } else {
      handleOutput(data, out);
    }
  });
}

//Reads the URL and prints it to the console.

async function webCat(url, out) {
  try {
    let resp = await axios.get(url);
    handleOutput(resp.data, out);
  } catch (err) {
    console.error(`Error fetching ${url}: ${err}`);
    process.exit(1);
  }
}

let path;
let out;
 if (process.argv[2] === '--out') {
  out = process.argv[3];
  path = process.argv[4];
} else {
  path = process.argv[2];
}

if (path.slice(0, 4) === 'http') {
  webCat(path, out);
} else {
  cat(path, out);
}