const fs = require('fs');
const program = require('commander');
const pkg = require('../package.json');
const dl = require('../lib/downloader');

const alfredHome = `${require("os").userInfo().homedir}/.alfred`;
const directories = {
    cases_path: `${alfredHome}/cases`,
    versions_archive: `${alfredHome}/versions_archive`
}

program
    .option('-n, --name <name>', 'the number or name of a case environment')
    .option('-v, --artVersion <artVersion>', 'the Artifactory version to deploy')
    .option('-d, --description <description>', 'case issue description. should be wrapped in quotations')
    .action(() => {
        checkDirectries();
        console.log('creating a new case');
        var caseProperties = {
            case_name: program.name,
            artifactory_version: program.artVersion,
            issue_description: program.description,
            case_path: `${directories.cases_path}/${program.name}`,
        }
        if (!fs.existsSync(caseProperties.case_path)) {
            fs.mkdirSync(caseProperties.case_path, { recursive: true });
            console.log(`case directory is: ${caseProperties.case_path}`)
        } else {
            console.log('case already exist, process finished');
        }
        const versionFile = `${directories.versions_archive}/jfrog-artifactory-pro-${artifactoryVersion}.zip`;
        if (!fs.existsSync(versionFile)) {
            console.log('file does not exist, downloading new one');
            dl.downloadArt(caseProperties.artifactory_version, directories.versions_archive);
        } else {
            downloadFinished();
        }
    });

program.parse(process.argv);

function checkDirectries() {
    console.log("Checking directories");
    for (var path in directories) {
        if (!fs.existsSync(directories[path])) {
            fs.mkdirSync(directories[path], { recursive: true });
            console.log(`${directories[path]} was not found, a new one was created.`);
        }
    }
}