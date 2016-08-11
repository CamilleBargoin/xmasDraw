const Draw = require("../Draw.js");

module.exports = React.createClass({

	getInitialState () {
	    return {
	    	showForm: false,
	    	draws: [],
	    	currentDraw: null
	    };
	},

	createDraw () {

		const newDraw = new Draw();

		this.setState({
			showForm: true,
			draws: this.state.draws.concat([newDraw]),
			currentDraw: (this.state.currentDraw === null) ? 0 : this.state.currentDraw + 1
		});
	},


	addParticipant (participant) {

		const currentDraw = this.state.draws[this.state.currentDraw];
		currentDraw.addParticipant(participant);

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
				 Materialize.toast("error: " + err.message, 4000, 'toastError');
			}
		});
	},

	render () {
		var results =this.state.draws.map(function(draw, index) {
			return draw.results;
		});


		return (
		  <div className="BodyComponent">
		  	<DrawResultsList results={results} />
		  	<div className="row">
		    	<a className="waves-effect waves-light btn" onClick={this.createDraw}>Nouvelle pige</a>
		  	</div>
		  	<DrawForm display={this.state.showForm} draw={this.state.draws[this.state.currentDraw]} addParticipant={this.addParticipant} executeDraw={this.executeDraw}/>
		  </div>
		);
	}
});


const DrawForm = React.createClass({

	getDefaultProps() {
		return {
		  draw: {participants: []}
		};
	},

	componentWillReceiveProps(nextProps) {
	    this.setState({
	    	list: nextProps.participants
	    });  
	},

	addParticipant () {

		if (this.refs["input"].value && this.refs["input"].value != "") {

			let newParticipant = {
				name: this.refs["input"].value
			};

			if (this.refs["inputSpouse"].value && this.refs["inputSpouse"].value != "") {
				newParticipant.spouse = this.refs["inputSpouse"].value;
			}

			this.props.addParticipant(newParticipant);

			this.refs["input"].value = "";
			this.refs["inputSpouse"].value = "";
		}
	},

	executeDraw (e) {
		e.preventDefault();
		this.props.executeDraw();
	},

	render () {

		if (this.props.display) {

			var participants = this.props.draw.participants.map(function(participant, index) {

				let label = participant.name;

				if (participant.spouse) {
					label += " (" + participant.spouse + ")";
				}

				return <div className="chip" key={index}>{label}</div>
			});

			return (
				<form>
					<div className="row col s6 participantsContainer">
						{participants}
					</div>
					<div className="row">
						<p>
							Entrer le nom d&#39;un nouveau participant. Si il/elle est en couple, vous pouvez directement ajouter son/sa coinjoint(e).
						</p>
						<br />

						<input type="text" placeholder="nom" className="col s2" ref="input" />

						<div className="col s2 spouseLabel">Conjoint(e) ?</div>
						<input type="text" placeholder="nom" className="col s2" ref="inputSpouse" />

						<div className="col s2">
	        				<a className="waves-effect waves-light btn" onClick={this.addParticipant}>Ajouter</a>
	        			</div>
	        		</div>
					<div className="row" style={{marginTop: "40px"}}>
	        			<a className="waves-effect waves-light btn purple darken-4" onClick={this.executeDraw}>Lancer le tirage !</a>
					</div> 
				</form>
			);
		}
		else 
			return <div />
	}
});


const DrawResultsList = React.createClass({
	getDefaultProps() {
		return {
		  draws: []
		};
	},
	
	render () {

		var drawList = this.props.results.map(function(resultSet, index) {
			return (
				<DrawResults key={index} index={index} resultSet={resultSet}/>
			);
		});


		return (
			<div className="row">
				<div className="col s9">
					{drawList}
				</div>
			</div>
		);
	}
});


const DrawResults = React.createClass({

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
				<div className="col s4">
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

