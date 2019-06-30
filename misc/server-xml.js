var xmlFile = (valueToIncrement) => {
    return `<Server port="${8015 + parseInt(valueToIncrement)}" shutdown="SHUTDOWN">

        <Service name="Catalina">
            <Connector port="${8081 + parseInt(valueToIncrement)}" sendReasonPhrase="true" relaxedPathChars='[]' relaxedQueryChars='[]' maxThreads="200" />

            <!-- Must be at least the value of artifactory.access.client.max.connections -->
            <Connector port="${8040 + parseInt(valueToIncrement)}" sendReasonPhrase="true" maxThreads="50" />

            <Connector port="${8019 + parseInt(valueToIncrement)}" protocol="AJP/1.3" sendReasonPhrase="true"/>

            <Engine name="Catalina" defaultHost="localhost">
                <Host name="localhost" appBase="webapps" startStopThreads="2" />
            </Engine>
        </Service>

    </Server>`
}

module.exports = { xmlFile }