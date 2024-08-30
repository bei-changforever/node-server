
const initWebsocket = require('../../bin/ThingSocket');

const BuildingsController = {
    intoBuilding: async (req, res) => {

        initWebsocket.ThingToSocket(req.body)

        res.send({
            code: 200,
            message: "success"
        });

    }
}


module.exports = BuildingsController