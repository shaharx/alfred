function getTemplate(){
    template.forEach(line => {
        console.log(line)
    })
}

const template = [
    `ART_VERSION=6.11.6`,
    `MASTER_KEY=$(openssl rand -hex 16)`,
    `BS_TEMPLATE=cluster-s3`,
    `DB_PROPERTIES='{"host":"localhost","port":"5432","psql_username":"postgres","psql_database":"postgres","psql_password":"pass","art_dbname":"artifactory","artifactory_db_username":"artifactory","artifactory_db_password":"password"}'`,
    `PROVIDER_PROPS="endpoint= identity= credential= bucketName= path="\n`,

    `# primary node`,
    `alfred deploy -v $ART_VERSION -d -p ha/primary`,
    `mkdir -p ha/primary/artifactory-pro-$ART_VERSION/etc/security/`,
    `echo $MASTER_KEY > ha/primary/artifactory-pro-$ART_VERSION/etc/security/master.key`,
    `alfred db set -t postgresql -n -o $DB_PROPERTIES`,
    `# alfred bs set -v 2 -t $BS_TEMPLATE -f`,
    `# alfred bs mod -n s3 -o "$PROVIDER_PROPS"`,
    `alfred ha set -o "node.id=art1 context.url=http://localhost:8091/artifactory/ membership.port=0 primary=true"`,
    `alfred port -o "8081:8091 8015:8025 8040:8050 8019:8029"`,
    `alfred start\n`,

    `# secondary node`,
    `alfred deploy -v $ART_VERSION -d -p ha/secondary`,
    `mkdir -p ha/secondary/artifactory-pro-$ART_VERSION/etc/security/`,
    `echo $MASTER_KEY > ha/secondary/artifactory-pro-$ART_VERSION/etc/security/master.key`,
    `alfred db set -t postgresql -o $DB_PROPERTIES --skipQuery`,
    `# alfred bs set -v 2 -t $BS_TEMPLATE -f`,
    `# alfred bs mod -n s3 -o "$PROVIDER_PROPS"`,
    `alfred ha set -o "node.id=art2 context.url=http://localhost:8092/artifactory/ membership.port=0 primary=false"`,
    `alfred port -o "8081:8092 8015:8026 8040:8051 8019:8030"`,
    `# alfred start`
]

module.exports = { getTemplate }