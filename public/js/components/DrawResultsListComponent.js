
const DrawResultsComponent = require("./DrawResultsComponent.js");

module.exports = React.createClass({
    getDefaultProps() {
        return {
          draws: []
        };
    },
    
    render () {

        var drawList = this.props.results.map(function(resultSet, index) {
            return (
                <DrawResultsComponent key={index} index={index} resultSet={resultSet}/>
            );
        });

        return (
            <div className="row">
                <div className="col s12">
                    {drawList}
                </div>
            </div>
        );
    }
});