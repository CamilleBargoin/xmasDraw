
module.exports = React.createClass({

    getDefaultProps() {
        return {
          draw: {results: []}
        };
    },

    getInitialState() {
        return {
            resultSet: this.props.resultSet  
        };
    },

    componentWillReceiveProps(nextProps) {
        this.setState({
            resultSet: nextProps.resultSet
        });  
    },

    render () {

        let results = <div />;

        if (this.state.resultSet && this.state.resultSet.length > 0) {

            results = this.state.resultSet.map(function(couple, index) {
                return (
                    <li className="collection-item  col s12" key={index} >
                        <strong>{couple["1"].name.toUpperCase()}</strong> avec <strong>{couple["2"].name.toUpperCase()}</strong>
                    
                    </li>
                );
            });

            return (
                <div className="col s6">
                    <h5>Résultats de la pige n°{this.props.index+1}:</h5>
                    <ul className="collection col s12">
                        {results}
                    </ul>
                </div>
            );
        }

        return <div />;


    }
});

