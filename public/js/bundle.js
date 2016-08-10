(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const drawService = require("../services/drawService.js");

const Draw = React.createClass({displayName: "Draw",

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
		  React.createElement("div", {className: "BodyComponent"}, 
		  	/*<DrawResultsList draws={this.state.draws} />*/
		  	React.createElement("div", {className: "row"}, 
		    	React.createElement("a", {className: "waves-effect waves-light btn", onClick: this.createDraw}, "Créer pige")
		  	), 
		  	React.createElement(DrawForm, {display: this.state.showForm, draw: this.state.draws[this.state.currentDraw], addParticipant: this.addParticipant, executeDraw: this.executeDraw})
		  )
		);
	}
});


var DrawForm = React.createClass({displayName: "DrawForm",

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
				return React.createElement("div", {className: "chip", key: index}, participant.name)
			});

			return (
				React.createElement("form", {onSubmit: this.executeDraw}, 
					React.createElement("div", {className: "row col s6 participantsContainer"}, 
						participants
					), 
					React.createElement("div", {className: "row"}, 
						React.createElement("input", {type: "text", placeholder: "nom", className: "col s2", ref: "input"}), 
						React.createElement("div", {className: "col s2 spouseLabel"}, "Conjoint(e) ?"), 
						React.createElement("input", {type: "text", placeholder: "nom", className: "col s2", ref: "inputSpouse"}), 
						React.createElement("div", {className: "col s2"}, 
							React.createElement("a", {className: "btn-floating btn-small waves-effect waves-light red", onClick: this.addParticipant}, React.createElement("i", {className: "material-icons"}, "add"))
	        			)
	        		), 
					React.createElement("div", {className: "row"}, 
						React.createElement("input", {type: "submit", value: "Submit"})
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


		const drawList = this.props.draws.map(function(draw, index) {
			return (
					React.createElement(DrawResults, {key: index, draw: draw})
			);
		});

		return (
			React.createElement("div", null, 

				drawList
			)
		);
	}
});


const DrawResults = React.createClass({displayName: "DrawResults",

	getDefaultProps() {
		return {
		  draw: []
		};
	},

	render () {

		const results = this.props.draw.map(function(couple, index) {
			return (
				React.createElement("li", {key: index}, 
					React.createElement("strong", null, couple["1"].name), " avec ", React.createElement("strong", null, couple["2"].name)
				
				)
			);
		});
		console.log(results);
		return (
			React.createElement("div", null, 
				React.createElement("h5", null, "Résultats de la pige:"), 
				React.createElement("ul", null, 
					results
				)
			)
		);
	}
});

module.exports = Draw;

},{"../services/drawService.js":3}],2:[function(require,module,exports){
var Draw = require("./components/Draw.js");


var HeaderComponent = React.createClass({displayName: "HeaderComponent",
  render: function() {
    return (
      React.createElement("div", {className: "HeaderComponent"}, 
        React.createElement("h1", null, "Pige de Noël"), 
        React.createElement("p", null, "blabla blabla blabla")
      )
    );
  }
});


var Main = React.createClass({displayName: "Main",
	render: function() {
		return (
			React.createElement("div", {className: "container"}, 
				React.createElement(HeaderComponent, null), 
				React.createElement(Draw, null)
			)
		);
	}
});

ReactDOM.render(
  React.createElement(Main, null),
  document.getElementById('content')
);

},{"./components/Draw.js":1}],3:[function(require,module,exports){
module.exports = function() {

	this.participants = [];

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
			var results = process(this.participants, []);

			callback(null, results);
			return 1;
		}
		else {
			callback({
				message: "number of particpants needs to be pair."
			});
			return 0;
		}

	};

	var process = function(list, matches, sameCoupleCounter = 0) {
		

		if (list.length > 0) {

			const first = list[0];
			const randomIndex = Math.floor(Math.random() * (list.length - 1) + 1);
			const second = list[randomIndex];

			if (second.name == first.spouse) {
				sameCoupleCounter ++;
				if (sameCoupleCounter == 10) {
					console.log("FAIL");
					return process(this.participants, []);
				}
				return process(list, matches, sameCoupleCounter);
			}

			// sameCoupleCounter = 0;

			matches.push({
				1: first, 
				2: second
			});

			list.splice(randomIndex, 1);
			list.splice(0, 1);

			return process(list, matches);

		}
		else {
			return matches;
		}
	};

// 	this.createCouple = function(list) {
// 		const first = list[0];
// console.log(first);
// 		let indexes = [];

// 		for (var i = 0; i < list.length; i++) {
// 			if (first.spouseIndex && i != first.spouseIndex) {
// 				indexes.push(i);
// 			}
// 			else
// 				indexes.push(i);
// 		}


// 		const randomIndex = Math.floor(Math.random() * (list.length - 1) + 1);
// 		const second = list[indexes[randomIndex]];
		
// 		list.splice(randomIndex, 1);
// 		list.splice(0, 1);

// 		return {
// 			first,
// 			second,
// 			list
// 		};
// 	};
};
},{}]},{},[2]);
