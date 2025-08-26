import * as fs from "fs";
import * as path from "path";

export function removeAllFilesSync(directory) {
  try {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      removeAllFilesSync(filePath);
      fs.rmdirSync(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  }
}catch(error) {
    console.error("Error deleting files from output directory", error);
  } 
}
