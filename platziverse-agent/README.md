# platziverse-agent

## Usage

``` js
const PlatziverseAgent = require('platziverse-agent')

const agent = new PlatziverseAgent({
    interval: 2000 // que cada 2 seg muestre info
})

agent.connect()

agent.on('agent/message', payload => {
    console.log(payload)
})

setTimeout(() => agent.disconnect(), 2000)
```