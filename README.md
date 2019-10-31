# Alfred
> Artifactory for every pocket

Alfred is a CLI application that controls standalone Artifactory servers via the ARTIFACTORY_HOME directory.
Using alfred you can deploy, upgrade and change configurations in Artifactory without the need to edit, copy, or download any configuration file.
Using alfred makes it easier to deploy and maintain multiple artifactory servers for different uses, it takes less space than other install types and any server that was deployed by alfred does not depend on it in order to work.

# Requirements

 * nodejs 10.x
 * npm 6.9.x
 * java for Artifactory

# Installation

Using NPM:

```sh
soon
```

Manual install
```
git clone https://github.com/shaharx/alfred.git
cd alfred
npm link
```
To see a list of available commands, use the --help under any top or sub command to view its available options and descriptions

## Deploying Artifactory
To deploy Artifactory, run the deploy command along with the mandatory -v (--artVersion) flag.
If the -p (--path) flag is not specified, artifactory will be deployed to the current working directory.
When deploying Artifactory, alfred checks in his cache (~/.alfred) if the version exsits. If not, the version archive will first be downloaded to the cache so next time download will not be necessary. This applies to other tools like the jdbc loggers, logback library plugins etc...

```sh
alfred deploy -v <x.x.x>
alfred deploy -v <x.x.x> -p 
```
Optionally, the -d --default flag can be passed to the deploy command to make the deployed server as default.
After the deployment, the deployed server can also be set as the default server using 
```
alfred set -d <path_to_artifactory_home>
```
This means that for the following commands, if the -p (--path) flag will not be specified, the command will be executed on the default server as can be seen in the next section

## Basic Usage Example

To start and stop artifactory, use the following commands

```
alfred start
alfred stop
```
This will start and stop the default server (artifactory_home) if set. Alternatively, if there is no default server, or the commands need to be run on a different server, you can specify a custom path to Artifactory home as follows:
```
alfred start -p relative/or/absolute/path/to/ARTIFACTORY_HOME
alfred stop -p relative/or/absolute/path/to/ARTIFACTORY_HOME
```
This applies to every command that is run on an artifactory server (home).
Using the -p flag, you can control any artifactory standalone home directory without any pre configurations.
All commands are run against the artifactory home directory and no need to specify subdirectories.
 * Note: for now, if the path is a server that was not deployed by artifactory, alfred will not be able to upgrade it due to the absence of the inatance_metadata file that is written to the artifactory home on deployment. Hack: put the following json as the instance_metadata >> {"version":"current_version"}

## Upgrading Artifactory

To upgrade artifactory, the -v version flag needs to be specified and the -p path flag is optional if a default server is set as was mentioned in the Deploying Artifactory section

```
alfred upgrade -v <x.x.x>
alfred upgrade -v <x.x.x> -p path/to/artifactory/home
```

## Common templates

Since commands can be long, the tamplates module prints common pre generated commands that can be copied and changed accordingly.
```
alfred templates
```
The templates command will print the tmplates for all the different configurations module.
The results can be filtered using the module name as a flag i.e. --bs --ha --db etc...

## Setting up Artifactory as HA node

In order to set up Artifactory as HA node, the following command needs to be run:

```
alfred ha set -o "node.id=art1 context.url=http://localhost:8081/artifactory/ membership.port=0 primary=true"
```
This will set up the ha-node.properties file in the etc directory. Values can be changed accordignly.

## Setting up 2 Nodes HA cluster

In order to fast setup a 2 nodes HA cluster run
```
alfred ha build -v x.x.x
```
Where x.x.x is the desired Artifactory version.
This will setup the cluster on ports 8091 for the primary and 8092 for the secondary, and postgres database.
The tmplate is available for modification using 'alfred templates --haBuild'

## Connect to external database

To set up an external database, the following command needs to be run:
```
alfred set db -t mysql
alfred set db -t mysql -p path/to/artifactory/home
```
Alfred currently supports only mysql and postgresql

In order to set a database, a json object must be passed including all the necessary parameters
```
alfred db set -t postgresql -o 'JSON_OBJECT'
```
Alternatively, if you don't pass the -o flag, default options will be used.

If docker is installed, the -n --new flag will set up a new docker container with a default image or the image the will be specified with the -i --image flag.

Setting the database will also download (if not cached) and deploy the jdbc logger, and will run the required inital queries on the database itself.
You can specify a connector version to download using the -c flag or use default versions by not specifying anything.
The --skipQuery flag can be passed to skip running the queries in the database and the database username and password will not be necessary and the --skipSettings flag can be passed to skip setting the database in Artifactory

## Setting up a binary store

Setting up a binary store process takes 2 basic steps
First, the config version needs to be set along with the chain template version as follows:

```
alfred bs set -v v1 -t full-db
```

Sample output to the binarystore.xml:
```
<config version="v1">
  <chain template="full-db"/>
</config>
```
Next, some binary stores require parameters to be provided to the provider in the chain template as for s3 that requires credentials in order to connect. A provider can be added to the binarystore.xml file using the mod command to modify a provider.
In order to add a provider, the mod command needs to be run as follows:

alfred bs mod -n <provider_name/id> -o <paramteres/options>

```
alfred bs set -v 2 -t s3 -- Setting a new chain template for s3
alfred bs mod -n s3 -o "endpoint=http://s3.amazonaws.com identity=XFJDHTU credential=GIOW/83gYYI path=some-path bucketName=shaharl-test"
```
Example output:
```
<config version="2">
  <chain template="s3"/>
  <provider id="s3" type="s3">
    <endpoint>http://s3.amazonaws.com</endpoint>
    <identity>XFJDHTU</identity>
    <credential>GIOW/83gYYI</credential>
    <path>some-path</path>
    <bucketName>the-bucket</bucketName>
  </provider>
</config>
```

The mod command will search for the provider name/id using the -n flag and will add the parameters under the -o flag. The parameters needs to be passed using the following template:
"key=value key=value key=value"
The whole argument needs to be enclosed with double quotes, each key value pair needs to be seperated by a space " " and each key needs to be seperated from its value using the "=" character
If the provider already contains the corresponding key, the value of that key will be modified.
If the provider does not exist under the chain template, it will be created automatically.

## Adding loggers to the logback.xml file

Using the logback command, the logback.xml file can be modified with loggers of choice.
To add a logger just run the following command
```
alfred logback add -n <logger_name> -l <log_level> -a <appender_name_of_your_choice>
```
The appender -a flag is optional and if not specified, the logger will write to the artifactory.log by default

## Setting custom ports
Using the port command, the current ports can be changed as follows:
```
alfred port -o "8081:8082 8015:8016 8040:8041"
```
Where the left value of each pair is the existing port and the right value is the target port regardless of the service names