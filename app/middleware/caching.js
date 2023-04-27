const { createClient } = require('redis')
const client = createClient({
    password: process.env.PASSWORD_REDIS,
    socket: {
        host: process.env.HOST_REDIS,
        port: process.env.PORT_REDIS
    }
})

client.connect()

module.exports = {
    cache: async (req, res, next) => {

        const key = req.originalUrl

        try {
            const cachedData = await client.get(key)
            if (cachedData !== null) {
                res.status(200).send(JSON.parse(cachedData))
                return
            }

            res.sendResponse = res.send
            res.send = (body) => {
                client.setEx(key, 3600, JSON.stringify(body))
                res.sendResponse(body)
            }
            next()
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
            next()
        }
    }
}
