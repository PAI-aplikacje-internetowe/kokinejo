const BaseGameController = require("./BaseGameController");

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

    filterStateForUser = (gameState) => {
        // do some filtering of state - don't show everyone
        // what cards other players have!
        return gameState;
    }
}

module.exports = ExampleGameController;
