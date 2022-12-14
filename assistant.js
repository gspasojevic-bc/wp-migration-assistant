import {execSync} from 'child_process';
import fsExtra from 'fs-extra';
import readline from 'readline';

const PUBLIC_FOLDER = './public';
const TEMP_FOLDER = './temp';

const TEMP_ITEMS_TO_RETURN = [
    `wp-config.php`,
    `wp-content/plugins`,
    `wp-content/uploads`
];

const GARBAGE_FILES = [
    TEMP_FOLDER,
    './node_modules',
    'package.json',
    'package-lock.json',
    'assistant.js',
    'assistant.sh',
    'assistant.zip'
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const moveFiles = (sourceFolderArr, destinationFolder, onlySelectedFiles = []) => {

    if (onlySelectedFiles.length) {
        fsExtra.ensureDirSync(`${PUBLIC_FOLDER}/wp-content`);

        onlySelectedFiles.forEach((selectedFile) => {
            if (!fsExtra.pathExistsSync(`${sourceFolderArr}/${selectedFile}`)) {
                console.log(`${selectedFile} could not be found and wasn't moved from ./temp to ./public.`);
                return;
            }

            fsExtra.moveSync(`${sourceFolderArr}/${selectedFile}`, `${destinationFolder}/${selectedFile}`);
            console.log(`${selectedFile} has been moved successfully.`);
        });
    } else {
        fsExtra.emptyDirSync(TEMP_FOLDER);
        console.log('Temp folder is empty now.');

        fsExtra.ensureDirSync(PUBLIC_FOLDER);

        fsExtra.readdirSync(sourceFolderArr).forEach((item) => {
            if (!fsExtra.pathExistsSync(`${sourceFolderArr}/${item}`)) {
                return;
            }

            fsExtra.moveSync(`${sourceFolderArr}/${item}`, `${destinationFolder}/${item}`);
            console.log(`${item} has been moved successfully.`);
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
    GARBAGE_FILES.forEach((file) => {
        fsExtra.removeSync(file, { recursive: true });
    });

    console.log('>>>>>>>> Clean up process is completed.');
};

const assistCloningFrom = (gitPath) => {
    moveFiles(PUBLIC_FOLDER, TEMP_FOLDER);
    cloneFromGitHub(gitPath);
    moveFiles(TEMP_FOLDER, PUBLIC_FOLDER, TEMP_ITEMS_TO_RETURN);
    cleanUpTempFiles();
};


rl.question('Please enter GitHub repository clone path: ', (gitRepoPath) => {
    if (!gitRepoPath) {
        console.log('GitHub repository not entered, exiting...');
        rl.close();
        return;
    }

    assistCloningFrom(gitRepoPath);

    rl.close();
});