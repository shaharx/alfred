const program = require('commander')
const pkg = require('../package.json')
const ls = require('../lib/log-system')

program
    .version(pkg.version)
    .description('Print common templates')
    .option('--bs', 'Binary store templates')
    .option('--db', 'Database templates')
    .option('--ha', 'HA templates')
    .action(() => {
        if (program.db) { dbTemplates() }
        if (program.bs) { bsTemplates() }
        if (program.ha) { haTemplates() }
    })

if (!process.argv.slice(2).length) {
    dbTemplates()
    bsTemplates()
    haTemplates()
}

program.parse(process.argv)

function bsTemplates() {
    
    var chain_templates = [
        `# file-system: alfred bs set -v v1 -t file-system -f\n`,
        `# cache-fs: alfred bs set -v v1 -t cache-fs -f\n`,
        `# full-db: alfred bs set -v v1 -t full-db -f\n`,
        `# full-db-direct: alfred bs set -v v1 -t full-db-direct -f\n`,
        `# s3: alfred bs set -v 2 -t s3 -f\n`,
        `# cluster-s3: alfred bs set -v 2 -t cluster-s3 -f\n`,
        `# google-storage: alfred bs set -v v1 -t google-storage -f\n`,
        `# cluster-google-storage: alfred bs set -v 2 -t cluster-google-storage -f\n`,
        `# azure-blob-storage: alfred bs set -v 1 -t azure-blob-storage -f\n`,
        `# cluster-azure-blob-storage: alfred bs set -v 2 -t cluster-azure-blob-storage -f\n`
    ]
    
    var providers = [
        `# s3/cluster-s3: alfred bs mod -n s3 -o "endpoint= identity= credential= bucketName= path="\n`,
        `# cluster-/-google-storage: alfred bs mod -n google-storage -o "endpoint= identity= credential= bucketName="\n`,
        `# azure/cluster-azure: alfred bs mod -n azure-blob-storage -o "accountName= accountKey= endpoint= containerName="\n`
    ]
    ls.warn('Binary store chain templates:\n')
    chain_templates.forEach(command => {
        ls.log(`${command}`)
    })
    ls.warn('Binary store providers:\n')
    providers.forEach(command => {
        ls.log(`${command}`)
    })
}

function dbTemplates() {
    var templates = [
        `# MYSQL: alfred db set -t mysql -o alfred db set -t mysql -o '{"host":"localhost","port":"3306","mysql_username":"root","mysql_password":"pass","art_dbname":"artdb","artifactory_db_username":"artifactory","artifactory_db_password":"password"}'`,
        `# POSTGRES: alfred db set -t postgresql -o '{"host":"localhost","port":"5432","psql_username":"postgres","psql_database":"postgres","psql_password":"pass","art_dbname":"artifactory","artifactory_db_username":"artifactory","artifactory_db_password":"password"}'`
    ]
    ls.warn('Databases:\n')
    templates.forEach(command => {
        ls.log(`${command}\n`)
    })
}

function haTemplates() {
    var templates = [
        `# HA: alfred ha set -o "node.id=art1 context.url=http://localhost:8081/artifactory/ membership.port=0 primary=true"`
    ]
    ls.warn('HA:\n')
    templates.forEach(command => {
        ls.log(`${command}`)
    })
}