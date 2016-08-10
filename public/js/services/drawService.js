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
		
		if (list.length > 0) {

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
