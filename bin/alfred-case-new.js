const manager = require('../lib/manager')
const fs = require('fs')
const program = require('commander')
const { exec } = require('child_process')
const dl = require('../lib/downloader')
const unzipper = require('../lib/unzipper')

program
    .option('-n, --name <name>', 'the number or name of a case environment')
    .option('-v, --artVersion <artVersion>', 'the Artifactory version to deploy')
    .option('-d, --description <description>', 'case issue description. should be wrapped in quotations')
    .action(() => {
        manager.getDirectories()
        console.log('creating a new case');
        var caseProperties = {
            case_name: program.name,
            issue_description: program.description,
            case_path: `${directories.cases_path}/${program.name}`
        }

        var instanceProperties = {
            instance_version: `${program.artVersion}`,
            instance_home: `${caseProperties.case_path}/primary/`
        }

        if (!fs.existsSync(caseProperties.case_path)) {
            fs.mkdirSync(caseProperties.case_path, { recursive: true });
            fs.writeFileSync(`${caseProperties.case_path}/case_properties.json`, JSON.stringify(caseProperties, undefined, 2));
            console.log(`case directory is: ${caseProperties.case_path}`);
        } else {
            console.log('case already exist, run \'alfred case update\' to modify it');
            process.exit();
        }

        const versionFile = `${directories.versions_archive}/jfrog-artifactory-pro-${instanceProperties.instance_version}.zip`;
        if (!fs.existsSync(versionFile)) {
            console.log('file does not exist, downloading new one');
            dl.downloadArt(instanceProperties.instance_version, directories.versions_archive);
            // process.exit()
        } else {
            unzipper.unzip(versionFile, `${instanceProperties.instance_home}`);
            console.log(`${instance_home}`);
            fs.renameSync(`${instance_home}/artifactory-pro-${instanceProperties.instance_version}`, `${instance_home}/artifactory`)
            exec(`chmod +x ${instanceProperties.instance_home}/bin/*`, (err, stdout, stderr) => {
                if (err) {
                    return err;
                }
            });
            console.log(`Instance ready. Run \'. ${instanceProperties.instance_home}/bin/artifactory.sh\' to start`);
        }
    });

program.parse(process.argv);