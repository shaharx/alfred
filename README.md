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

## Connect to an external database

To set up an external database, the following command needs to be run:
```
alfred set db -t mysql
alfred set db -t mysql -p path/to/artifactory/home
```
Alfred currently supports only mysql and posqtgres
This will prompt you for the database settings such as host, port etc.
Setting the database will also downaload (if not cached) and deploy the jdbc logger, and will run the required inital queries on the database itself.
You can specify a connector version to download using the -c flag or use default versions by not specifying anything.

## Adding loggers to the logback.xml file

Using the logback command, the logback.xml file can be modified with loggers of choice.
If the logger has an apprender-ref key configured, alfred will add the corresponding appender aswell.
Alfred checks 
In order to add loggers, the logback library first needs to be downloaded using

```
alfred logback download -n <username> -p <password>
```
Then, in order to add loggers, the logger name needs to be specified the -n <logger_name> flag
```
alfred logback add -n org.apache.http
alfred logback add -n org.jfrog.storage.JdbcHelper -p artifactory-pro-6.11.6/
```
For your convenience, you can run the 'alfred logback list' to view all the available logger in the logback library snippet
When setting a logger, alfred will look for it in ${alfredHome}/tools/logback-snippets under the loggers directory or under the appenders directory if one is needed.
Until the loggers bundle will be available, the loggers need to be added to those directories manually under a file for each logger/appender snippet in the corresponding folder with a .xml extension

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
    <bucketName>shaharl-test</bucketName>
  </provider>
</config>
```

The mod command will search for the provider name/id using the -n flag and will add the parameters under the -o flag. The parameters needs to be passed using the following template:
"key=value key=value key=value"
The whole argument needs to be enclosed with double quotes, each key value pair needs to be seperated by a space " " and each key needs to be seperated from its value using the "=" character
If the provider already contains the corresponding key, the value of that key will be modified.
If the provider does not exist under the chain template, it will be created automatically.