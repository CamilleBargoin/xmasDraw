
module.exports = React.createClass({

	getDefaultProps() {
		return {
		  draw: {participants: []}
		};
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



			// list of people registered for the draw
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


