import {existsSync, mkdirSync, rmdirSync, readdirSync, renameSync} from 'fs';
import {execSync} from 'child_process';
import fsExtra from 'fs-extra';

const publicFolderPath = './public';
const tempFolderPath = './temp';

const moveFiles = (sourceFolderArr, destinationFolder, onlySelectedFiles = []) => {

    if (onlySelectedFiles.length) {
        if (!existsSync(`${publicFolderPath}/wp-content`)) {

            mkdirSync(`${publicFolderPath}/wp-content`);
            console.log('wp-content dir created successfully in ./public .');
        }

        onlySelectedFiles.forEach((selectedFile) => {
            if (existsSync(`${sourceFolderArr}/${selectedFile}`)) {
                fsExtra.moveSync(`${sourceFolderArr}/${selectedFile}`, `${destinationFolder}/${selectedFile}`, { overwrite: true });
                console.log(`${selectedFile} has been moved successfully.`);
            } else {
                console.log(`${selectedFile} not found. File not moved.`);
            }
        });
    } else {
        if (existsSync(tempFolderPath)) {
            rmdirSync(tempFolderPath, { recursive: true });
            console.log('Temp dir found and deleted successfully.');
        }

        mkdirSync(tempFolderPath);
        console.log('New temp created successfully.');

        readdirSync(sourceFolderArr).forEach((item) => {
            if (existsSync(`${sourceFolderArr}/${item}`)) {
                renameSync(`${sourceFolderArr}/${item}`, `${destinationFolder}/${item}`);
                console.log(`${item} has been moved successfully.`);
            }
        });
    }


};

const cloneFromGitHub = (pathToGitRepo) => {
    execSync(`git clone ${pathToGitRepo} ./public`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        console.log('stdout');
    });
};

const cleanUpTempFiles = () => {
    rmdirSync(tempFolderPath, { recursive: true });
    rmdirSync('./node_modules', { recursive: true });
    rmdirSync('package.json', { recursive: true });
    rmdirSync('package-lock.json', { recursive: true });
    rmdirSync('app.js', { recursive: true });
    console.log('>>>>>>>> Clean up process is completed.');
};


moveFiles(publicFolderPath, tempFolderPath);
cloneFromGitHub('git@github.com:BetterCollective/wordpress-bettingsidor-se.git');
moveFiles(tempFolderPath, publicFolderPath, [
    `wp-config.php`,
    `wp-content/plugins`,
    `wp-content/uploads`
]);
cleanUpTempFiles();
