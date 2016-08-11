const Draw = require("../Draw.js");
const DrawFormComponent = require("./DrawFormComponent.js");
const DrawResultsListComponent = require("./DrawResultsListComponent.js");


module.exports = React.createClass({

    getInitialState () {
        return {
            showForm: false,
            draws: [],
            currentDraw: null
        };
    },

    createDraw () {

        let newDraw = new Draw();

        this.setState({
            showForm: true,
            draws: this.state.draws.concat([newDraw]),
            currentDraw: (this.state.currentDraw === null) ? 0 : this.state.currentDraw + 1
        });
    },


    addParticipant (participant) {

        const currentDraw = this.state.draws[this.state.currentDraw];
        currentDraw.addParticipant(participant);

        // tells react to re-render the page with updated data
        this.forceUpdate();
    },

    executeDraw () {

        const self = this;

        this.state.draws[this.state.currentDraw].execute(function(err, results) {

            if (!err) {
                self.setState({
                    showForm: false
                });
            }
            else {
                // display errors / warning dialog 
                if (err.type == "warning")
                    Materialize.toast("Attention: " + err.message, 4000, 'toastWarning');
                else
                    Materialize.toast("Erreur: " + err.message, 4000, 'toastError');
            }
        });
    },

    render () {
        var results = this.state.draws.map(function(draw, index) {
            return draw.results;
        });

        return (
          <div className="BodyComponent">
            <DrawResultsListComponent results={results} />
            <div className="row">
                <a className="waves-effect waves-light btn" onClick={this.createDraw}>Nouvelle pige</a>
            </div>
            <DrawFormComponent display={this.state.showForm} draw={this.state.draws[this.state.currentDraw]} addParticipant={this.addParticipant} executeDraw={this.executeDraw}/>
          </div>
        );
    }
});

