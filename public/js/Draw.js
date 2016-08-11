module.exports = function() {

    this.participants = [];
    this.results = [];

    // Adds a new participant to the list, and if a spouse is given, it adds it too.
    this.addParticipant = function(participant) {

        if (typeof participant !== "object" ) {
            throw new Error("missing argument");
        }

        if (participant.name) {
            this.participants.push(participant);

            if (participant.spouse) {
                const secondParticipant = {name: participant.spouse, spouse: participant.name};
                this.participants.push(secondParticipant);
            }
        }

    };


    //  runs several checks to be sure the list of participants is good, then calls
    // the recursive *process* method to build the result array and pass it to
    // a callback
    this.execute = function (callback) {

        if (this.participants.length == 0) {
            callback({
                type: "error",
                message: "Il faut au moins 2 particpants pour lancer le tirage."});
            return 0;
        }
        else if (this.participants.length % 2 == 0) {

            if (this.participants.length == 2) {
                if (this.participants[0].spouse == this.participants[1].name) {
                    callback({
                        type: "warning",
                        message: "Il faut plus qu'un couple pour lancer le tirage."
                    });
                    return 0;
                }
            }

            // the list is shuffled first
            shuffle(this.participants);

            this.results = this.process(this.participants, []);

            callback(null, this.results);
            return 1;
        }
        else {
            callback({
                type: "warning",
                message: "Le nombre de participant doit être pair pour lancer le tirage."
            });
            return 0;
        }

    };


    // recursive method.
    // randomly matches 2 persons from the array *list* and add them in the *matches* array,
    // until there is nobody left in the array *list*.
    this.process = function(list, matches, sameCoupleCounter = 0) {

        if (!list && !matches) {
            throw new Error("missing argument");
        }

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
                    return this.process(this.participants, []);
                }

                // retry the matching process
                return this.process(list, matches, sameCoupleCounter);
            }

            matches.push({
                1: firstPerson, 
                2: secondPerson
            });

            // remove the matched person from the array containing the remaining participants
            list.splice(randomIndex, 1);
            list.splice(0, 1);

            return this.process(list, matches);
        }
        else {
            return matches;
        }
    };


    var shuffle = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
};
