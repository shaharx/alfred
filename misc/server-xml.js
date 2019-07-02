var xmlFile = (valueToIncrement) => {
    const server_port = 8015 + parseInt(valueToIncrement),
        artifactory_port = 8081 + parseInt(valueToIncrement),
        access_port = 8040 + parseInt(valueToIncrement),
        ajp_port = 8019 + parseInt(valueToIncrement)

    console.log(`The following ports were set:\nArtifactory port: ${artifactory_port}\nAccess port: ${access_port}`)

    return `<Server port="${server_port}" shutdown="SHUTDOWN">

        <Service name="Catalina">
            <Connector port="${artifactory_port}" sendReasonPhrase="true" relaxedPathChars='[]' relaxedQueryChars='[]' maxThreads="200" />

            <!-- Must be at least the value of artifactory.access.client.max.connections -->
            <Connector port="${access_port}" sendReasonPhrase="true" maxThreads="50" />

            <Connector port="${ajp_port}" protocol="AJP/1.3" sendReasonPhrase="true"/>

            <Engine name="Catalina" defaultHost="localhost">
                <Host name="localhost" appBase="webapps" startStopThreads="2" />
            </Engine>
        </Service>

    </Server>`
}

module.exports = { xmlFile }