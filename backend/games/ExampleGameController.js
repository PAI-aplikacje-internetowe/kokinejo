const BaseGameController = require("./BaseGameController");
const express = require('express');

class ExampleGameController extends BaseGameController {
    constructor() {
        super('tic-tac-toe');
        this.getRouter().get('/make_move', this.extraFunction);
        // don't use express.Router() - use this.getRouter()
    }

    extraFunction = (req, res) => {
        res.json({
            status: "this is extra function, e.g. with makeMove implementation"
        })
    }
}

module.exports = ExampleGameController;
