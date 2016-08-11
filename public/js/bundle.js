(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function() {

	this.participants = [];
	this.results = [];

	this.addParticipant = function(participant) {

		if (participant.name) {
			this.participants.push(participant);

			if (participant.spouse) {
				const secondParticipant = {name: participant.spouse, spouse: participant.name};
				this.participants.push(secondParticipant);
			}
		}

	};

	this.execute = function (callback) {
		if (this.participants.length == 0) {
			callback({message: "you need at least 2 participants."});
			return 0;
		}
		else if (this.participants.length % 2 == 0) {

			if (this.participants.length == 2) {
				if (this.participants[0].spouse == this.participants[1].name) {
					callback({
						message: "you need more people"
					});
					return 0;
				}
			}
			this.results = process(this.participants, []);

			callback(null, this.results);
			return 1;
		}
		else {
			callback({
				message: "number of particpants needs to be pair."
			});
			return 0;
		}

	};


	// recursive method.
	// randomly matches 2 persons from the array *list* and add them in the *matches* array,
	// until there is nobody left in the array *list*.
	var process = function(list, matches, sameCoupleCounter = 0) {
		
		if (list && list.length > 0) {

			const firstPerson = list[0];
			const randomIndex = Math.floor(Math.random() * (list.length - 1) + 1);
			const secondPerson = list[randomIndex];

			// if the two people matched are married together
			if (secondPerson.name == firstPerson.spouse) {

				sameCoupleCounter ++;

				// if this is the 10th time in a row for this married couple
				// we relaunch the entire draw from the begining to avoid infinite loop
				if (sameCoupleCounter == 10) {
					return process(this.participants, []);
				}

				// retry the matching process
				return process(list, matches, sameCoupleCounter);
			}

			matches.push({
				1: firstPerson, 
				2: secondPerson
			});

			// remove the matched person from the array containing the remaining participants
			list.splice(randomIndex, 1);
			list.splice(0, 1);

			return process(list, matches);
		}
		else {
			return matches;
		}
	};
};
},{}],2:[function(require,module,exports){
const Draw = require("../Draw.js");

module.exports = React.createClass({displayName: "exports",

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
		  React.createElement("div", {className: "BodyComponent"}, 
		  	React.createElement(DrawResultsList, {results: results}), 
		  	React.createElement("div", {className: "row"}, 
		    	React.createElement("a", {className: "waves-effect waves-light btn", onClick: this.createDraw}, "Nouvelle pige")
		  	), 
		  	React.createElement(DrawForm, {display: this.state.showForm, draw: this.state.draws[this.state.currentDraw], addParticipant: this.addParticipant, executeDraw: this.executeDraw})
		  )
		);
	}
});


const DrawForm = React.createClass({displayName: "DrawForm",

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

				return React.createElement("div", {className: "chip", key: index}, label)
			});

			return (
				React.createElement("form", null, 
					React.createElement("div", {className: "row col s6 participantsContainer"}, 
						participants
					), 
					React.createElement("div", {className: "row"}, 
						React.createElement("p", null, 
							"Entrer le nom d'un nouveau participant. Si il/elle est en couple, vous pouvez directement ajouter son/sa coinjoint(e)."
						), 
						React.createElement("br", null), 

						React.createElement("input", {type: "text", placeholder: "nom", className: "col s2", ref: "input"}), 

						React.createElement("div", {className: "col s2 spouseLabel"}, "Conjoint(e) ?"), 
						React.createElement("input", {type: "text", placeholder: "nom", className: "col s2", ref: "inputSpouse"}), 

						React.createElement("div", {className: "col s2"}, 
	        				React.createElement("a", {className: "waves-effect waves-light btn", onClick: this.addParticipant}, "Ajouter")
	        			)
	        		), 
					React.createElement("div", {className: "row", style: {marginTop: "40px"}}, 
	        			React.createElement("a", {className: "waves-effect waves-light btn purple darken-4", onClick: this.executeDraw}, "Lancer le tirage !")
					)
				)
			);
		}
		else 
			return React.createElement("div", null)
	}
});


const DrawResultsList = React.createClass({displayName: "DrawResultsList",
	getDefaultProps() {
		return {
		  draws: []
		};
	},
	
	render () {

		var drawList = this.props.results.map(function(resultSet, index) {
			return (
				React.createElement(DrawResults, {key: index, index: index, resultSet: resultSet})
			);
		});


		return (
			React.createElement("div", {className: "row"}, 
				React.createElement("div", {className: "col s9"}, 
					drawList
				)
			)
		);
	}
});


const DrawResults = React.createClass({displayName: "DrawResults",

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

		let results = React.createElement("div", null);

		if (this.state.resultSet && this.state.resultSet.length > 0) {

			results = this.state.resultSet.map(function(couple, index) {
				return (
					React.createElement("li", {className: "collection-item  col s12", key: index}, 
						React.createElement("strong", null, couple["1"].name.toUpperCase()), " avec ", React.createElement("strong", null, couple["2"].name.toUpperCase())
					
					)
				);
			});

			return (
				React.createElement("div", {className: "col s4"}, 
					React.createElement("h5", null, "Résultats de la pige n°", this.props.index+1, ":"), 
					React.createElement("ul", {className: "collection col s12"}, 
						results
					)
				)
			);

			
		}

		return React.createElement("div", null);


	}
});
},{"../Draw.js":1}],3:[function(require,module,exports){
var DrawComponent = require("./components/DrawComponent.js");


var HeaderComponent = React.createClass({displayName: "HeaderComponent",
  render: function() {
    return (
      React.createElement("div", {className: "HeaderComponent"}, 
        React.createElement("h1", null, "Pige de Noël"), 
        React.createElement("p", null, "Cette petite application permet de créer des piges et d'y ajouter des participants.", React.createElement("br", null), 
        "Il est ensuite possible de lancer le tirage automatique. Les résultats seront automatiquement affichés."
        )
      )
    );
  }
});


var Main = React.createClass({displayName: "Main",
	render: function() {
		return (
			React.createElement("div", {className: "container"}, 
				React.createElement(HeaderComponent, null), 
				React.createElement(DrawComponent, null)
			)
		);
	}
});

ReactDOM.render(
  React.createElement(Main, null),
  document.getElementById('content')
);

},{"./components/DrawComponent.js":2}]},{},[3]);
