var app = new this.Vue({
    el: '#app',
    data: {
        message: 'Click the start game button!',
        buttonText: 'Start Game',
        show: 'all',
        letters: [],
        guesses: 0,
        word: 'WELCOME',
        gameIsStarted: false,
        gameIsWon: false,
        displayedWord: '',
    },
    computed: {
        activeTodos() {
            return this.letters.filter(item => {
                return !item.isActive;
            });
        },
        filteredLetters() {
            if (this.show === 'inactive')
                return this.letters.filter(item => {
                    return !item.isActive;
                });
            if (this.show === 'active')
                return this.letters.filter(item => {
                    return item.isActive;
                });
            return this.letters;
        },
        guessedLetters() {
            return this.letters.filter(item => {
                return !item.isActive;
            });
        },
    },
    methods: {
        
        // Updates the displayed word and guesses based on player's guess
        updateWord() {
            var correctGuess = false;
            for (var i = 0; i < this.word.length; i++) {

                for (var j = 0; j < this.guessedLetters.length; j++) {

                    //console.log(this.displayWord[i]);
                    if (this.displayedWord[i] == '-' && this.guessedLetters[j].letter == this.word[i]) {
                        this.displayedWord = this.replaceCharAt(this.displayedWord, i, this.guessedLetters[j].letter);
                        correctGuess = true;
                    }
                }
            }
            if (!correctGuess) {
                this.guesses--;
            }
            this.updateStatus();
            return this.displayedWord;
        },
        
        // REST API call to get a random word and reset the displayed word/dashes
        getNewWord() {
            console.log("In Fetch " + this.prefix);
            var url = "https://random-word-api.herokuapp.com/word?key=jecgaa&number=1";
            console.log("URL " + url);

            console.log("old word: " + this.word);

            (async() => {
                fetch(url)
                    .then((data) => {
                        return (data.json());
                    })
                    .then((randomWord) => {
                        console.log("randomWord");
                        console.log(randomWord);
                        this.word = randomWord[0].toUpperCase();
                        console.log("Got randomWord");

                        // Reset the displayedWord
                        this.displayedWord = '';
                        for (var i = 0; i < this.word.length; i++) {
                            this.displayedWord += '-';
                        }
                    });
            })();

            console.log("ending getnewword fn word: " + this.word);
        },
        
        // Starts the game by picking a word and resetting letters and number of guesses
        startGame() {
            console.log("Starting game");
            this.message = "Click a letter to make a guess.";
            this.gameIsWon = false;

            // Reset letters
            for (var i = 0; i < this.letters.length; i++) {
                this.letters[i].isActive = true;
            }

            // Pick a new word
            this.getNewWord();

            // Reset number of guesses
            this.guesses = 8;

            // The game is started!
            this.gameIsStarted = true;
            this.buttonText = "Restart Game";
        },

        // Updates message to player as well as gameIsStarted and gameIsWon statuses
        updateStatus() {
            if (this.displayedWord.includes('-')) {
                if (this.guesses == 0) {
                    this.message = "Sorry, you are out of guesses. The word was " + this.word;
                    this.gameIsStarted = false;
                }
                else {
                    this.message = "Click a letter to make a guess.";
                }
            }
            else {
                this.message = "Congratulations! You WON!";
                this.gameIsStarted = false;
                this.gameIsWon = true;
            }
        },
        
        // Returns number of guesses player has left
        displayGuesses() {
            return this.guesses;
        },

        // Replaces a char in word at the indicated index
        replaceCharAt(word, index, replacement) {
            return word.substr(0, index) + replacement + word.substr(index + replacement.length);
        },

        // Methods show appropriate letters
        showAll() {
            this.show = 'all';
        },
        showRemaining() {
            this.show = 'active';
        },
        showGuessed() {
            this.show = 'inactive';
        },

        // Sets isActive attribute to false for the letter that was guessed
        guessLetter(item) {
            if (this.guesses > 0 && !this.gameIsWon) {
                var index = this.letters.indexOf(item);
                if (this.letters[index].isActive) {
                    this.letters[index].isActive = false;
                }
                this.updateWord();
            }
        },
    },

    // Populate letters first thing and starts the game
    beforeMount() {
        for (var i = 0; i < 26; i++) {
            this.letters.push({ letter: String.fromCharCode(65 + i), isActive: true });
        }
        this.startGame();
    },
});