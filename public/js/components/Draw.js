const drawService = require("../services/drawService.js");

const Draw = React.createClass({

	getInitialState () {
	    return {
	    	showForm: false,
	    	participants: [],
	    	draws: [],
	    	currentDraw: null
	    };
	},

	createDraw () {

		const newDraw = new drawService();
		
		this.setState({
			showForm: true,
			draws: this.state.draws.concat([newDraw]),
			currentDraw: (this.state.currentDraw == null) ? 0 : this.state.currentDraw ++
		});
	},


	// ex: {name: "bob"} or {name: "bob", spouse: "kim"}
	addParticipant (participant) {

		let draw = this.state.draws[this.state.currentDraw];

		draw.addParticipant(participant);

		this.forceUpdate();
	},

	executeDraw () {

		const self = this;
		this.state.draws[this.state.currentDraw].execute(function(err, results) {
			if (!err) {
				console.log(results);
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


		return (
		  <div className="BodyComponent">
		  	{/*<DrawResultsList draws={this.state.draws} />*/}
		  	<div className="row">
		    	<a className="waves-effect waves-light btn" onClick={this.createDraw}>Créer pige</a>
		  	</div>
		  	<DrawForm display={this.state.showForm} draw={this.state.draws[this.state.currentDraw]} addParticipant={this.addParticipant} executeDraw={this.executeDraw}/>
		  </div>
		);
	}
});


var DrawForm = React.createClass({

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
				return <div className="chip" key={index}>{participant.name}</div>
			});

			return (
				<form onSubmit={this.executeDraw}>
					<div className="row col s6 participantsContainer">
						{participants}
					</div>
					<div className="row">
						<input type="text" placeholder="nom" className="col s2" ref="input" />
						<div className="col s2 spouseLabel">Conjoint(e) ?</div>
						<input type="text" placeholder="nom" className="col s2" ref="inputSpouse" />
						<div className="col s2">
							<a className="btn-floating btn-small waves-effect waves-light red" onClick={this.addParticipant}><i className="material-icons">add</i></a>
	        			</div>
	        		</div>
					<div className="row">
						<input type="submit" value="Submit" />
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


		const drawList = this.props.draws.map(function(draw, index) {
			return (
					<DrawResults key={index} draw={draw} />
			);
		});

		return (
			<div>

				{drawList}
			</div>
		);
	}
});


const DrawResults = React.createClass({

	getDefaultProps() {
		return {
		  draw: []
		};
	},

	render () {

		const results = this.props.draw.map(function(couple, index) {
			return (
				<li key = {index} >
					<strong>{couple["1"].name}</strong> avec <strong>{couple["2"].name}</strong>
				
				</li>
			);
		});
		console.log(results);
		return (
			<div>
				<h5>Résultats de la pige:</h5>
				<ul>
					{results}
				</ul>
			</div>
		);
	}
});

module.exports = Draw;