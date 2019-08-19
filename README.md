# Alfred
> Alfred is a CLI app that controls standalone Artifactory server via the ARTIFACTORY_HOME directory.

Using alfred you can deploy, upgrade and change configurations in Artifactory without the need to edit, copy, or download any configuration file. All is done using the alfred command.
Using alfred makes it easier to deploy and maintain multiple artifactory servers for the different uses, it takes less space than other install types and any server that was deployed by alfred does not depend on it in order to work as with docker.

## Requirements

nodejs 10.x
npm 6.9.x
java for Artifactory

## Installation

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

## Deploying Artifactory

To deploy Artifactory, run the deploy command along with the mandatory -v (--version) flag.
If the -p (--path) flag is not specified, artifactory will be deployed to the current working directory.

```sh
alfred deploy -v <x.x.x>
alfred deploy -v <x.x.x> -p 
```

After the deployment, there will be a prompt whether to set the deployed server as the default server or not.
This means that for the following commands, if the -p (--path) flag will not be specified, the command will be executed on the default server as can be seen in the next section section

## Basic Usage

To start and stop artifactory, use the following commands

```
alfred start
alfred stop
```
This will start and stop the default server if set. Alternatively, if there is no default server, or the commands need to be run on a different server, you can specify a custom path to Artifactory home as follows:
```
alfred start -p relative/absolute
alfred stop -p relative/absolute
```
This applies to every command that is run on an artifactory server.
Using the -p flag, you can control any artifactory home directory that was deployed by alfred without any pre configurations.
Note: all commands are run against the artifactory home directory. No need to specify any subdirectories, alfred will handle it

## Upgrading Artifactory

To upgrade artifactory, the -v version flag need to be specified and the -p path flag is optional if a default server as was mentioned before

```
alfred upgrade -v <x.x.x>
alfred upgrade -v <x.x.x> -p path/to/artifactory/home
```

## Connect to an external database

To set an external database, the following command needs to be run:
```
alfred set db -t mysql
alfred set db -t mysql -p path/to/artifactory/home
```
This will prompt you for the database settings such as ip, port etc...
Setting the database will also and deploy (and download if was not cached already) the jdbc logger and will run the required inital queries on the database itself.
You can specify a connector version to download using the -c flag or use default versions by not specifying anything.

## Adding loggers to the logback.xml file

Using the logback command, the logback.xml file can be modified with loggers of choice.
If the logger has an apprender-ref key configured, alfred will add the corresponding appender aswell.

```
alfred logback add -n org.apache.http
alfred logback add -n org.jfrog.storage.JdbcHelper -p artifactory-pro-6.11.6/
```
When setting a logger, alfred will look for it in ${alfredHome}/tools/logback-snippets under the loggers directory or under the appenders directory if an one is needed.
Until the loggers bundle will be available, the loggers need to be added to those directories manually under a file for each logger/appender snippet in the corresponding folder with the .xml extension

## Setting custom ports

Custom ports can be set using the port command as follows:

```
alfred set port -i 3
```
The above command will increment all the port values under in the server.xml file by 3 meaning that if the default port is 8081, it will change to 8084, 8040 to 8043 etc. 
Currently, the server.xml file is overwritten in upgrade so remember to back it up.
