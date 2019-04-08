const fs = require('fs');
const program = require('commander');
const { exec } = require('child_process');
const dl = require('../lib/downloader');
const unzipper = require('../lib/unzipper');

const alfredHome = `${require("os").userInfo().homedir}/.alfred`;
const directories = {
    cases_path: `${alfredHome}/cases`,
    versions_archive: `${alfredHome}/versions_archive`
}

program
    .option('-n, --name <name>', 'the number or name of the case environment')
    .option('-u, --upgrade <upgrade>', 'the Artifactory version to upgrade to')
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
            fs.writeFileSync(`${caseProperties.case_path}/case_properties.json`, JSON.stringify(caseProperties, undefined, 2));
            console.log(`case directory is: ${caseProperties.case_path}`);
        } else {
            console.log('case already exist, run \'alfred case update\' to modify it');
            process.exit();
        }
        const versionFile = `${directories.versions_archive}/jfrog-artifactory-pro-${caseProperties.artifactory_version}.zip`;
        if (!fs.existsSync(versionFile)) {
            console.log('file does not exist, downloading new one');
            dl.downloadArt(caseProperties.artifactory_version, directories.versions_archive);
            // process.exit()
        }
        unzipper.unzip(versionFile, `${directories.cases_path}/${caseProperties.case_name}`);
        exec(`chmod +x ${directories.cases_path}/${caseProperties.case_name}/artifactory-pro-${caseProperties.artifactory_version}/bin/*`, (err, stdout, stderr) => {
            if (err) {
                return err;
            }
        });
        console.log(`Instance ready. Run \'. ${directories.cases_path}/${caseProperties.case_name}/artifactory-pro-${caseProperties.artifactory_version}/bin/artifactory.sh\' to start`);
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