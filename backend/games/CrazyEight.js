const BaseGameController = require('./BaseGameController');
const utils = require('./../utils');

class CrazyEight extends BaseGameController {
    constructor() {
        super('crazy-eight');
        this.getRouter().post('/:gameId/make_move', this.makeMove);
    }

    makeMove = (req, res) => {
        res.json({
            status: "This is crazy eight!"
        })
    }
}

module.exports = CrazyEight;
