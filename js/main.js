//###############################################################################
//
// NEBULA GAMES - Website
// Main Script - Author: Luca Mastroianni || Bluemoon
// Date: 27 November 2021
//
//###############################################################################

(() => {

    const preload_json = (name, callback) => {
        fetch("js/" + name + ".json").then(response => {
            return response.json();
        }).then(data => {
            return callback(data);
        })
    }

    //###############################################################################
    //
    // LOCALIZATION MANAGER
    //
    //###############################################################################

    Language = class {

        static LANGUAGE_CHANGE = "languagechange"
        static LANGUAGE_FILE = "language"
        static LOCAL_STORAGE_KEY = "NebulaGames_Language"

        static init(callback) {
            this.locale = localStorage.getItem(Language.LOCAL_STORAGE_KEY) || "it";
            this._events = {};
            this.preload(callback);
            
        }

        static preload(callback) {
            preload_json(Language.LANGUAGE_FILE, data => {
                this.languages = data; 
                callback()
            })
        }

        static on(e, f) {
            if(!this._events[e]) {
                this._events[e] = [];
            }
            this._events[e].push(f)
        }

        static emit(e) {
            if(!!this._events[e]) {
                for(const event of this._events[e]) {event()}
            }
        }

        static switchLanguage(locale) {
            if(this.locale === locale) {return;}
            this.locale = locale; 
            localStorage.setItem(Language.LOCAL_STORAGE_KEY,this.locale);
            this.emit(Language.LANGUAGE_CHANGE)
        }

        static getString(key) {
            return this.languages[key][this.locale]
        } 

        static isLocale(locale) {
            return this.locale === locale
        }
    }

    //###############################################################################
    //
    // APP
    //
    //###############################################################################

    App = class {

        static _settings() {
            return { resizeTo: window }
        }

        static init() {
            this.application = new PIXI.Application(this._settings());
            this.stage = this.application.stage
            this.ticker = this.application.ticker
            this.mainLoop();
        }

        static mainLoop() {
            window.addEventListener('DOMContentLoaded', (event) => {
                document.fonts.ready.then(() => {
                    Language.init(() => {
                        document.body.appendChild(this.application.view);
                        this.initElements();
                        this.ticker.add(this.update, this);
                    })
                })
            });
        }

        static defaultStyle(size = 28, fill = "white") {
            return {
                fontFamily: "Oswald",
                fontSize: size,
                padding: 100,
                fill: fill
            }
        }

        static initElements() {
            // Create Language Buttons
            const italian = new PIXI.Text("ITALIAN", this.defaultStyle(18));
            italian.interactive = true;
            italian.on("pointerdown", () => {
                Language.switchLanguage("it")
            })
            const MARGIN = Math.max(Math.floor(this.width()/80), 20)
            italian.alpha = Language.isLocale("it") ? 1 : 0.7;
            italian.position.set(MARGIN, MARGIN);
            italian.buttonMode = true
            this.add(italian)
            const english = new PIXI.Text("ENGLISH", this.defaultStyle(18));
            english.interactive = true;
            english.on("pointerdown", () => {
                Language.switchLanguage("en")
            })
            english.alpha = Language.isLocale("en") ? 1 : 0.7;
            english.position.set(italian.x + english.width + 5,italian.y);
            english.buttonMode = true
            this.add(english)

            // TEMPORARY
            const wip = new PIXI.Text(Language.getString("wip"), this.defaultStyle(48));
            this.add(wip);
            wip.anchor.set(0.5)
            wip.position.set(this.width()/2,this.height()/2)

            Language.on(Language.LANGUAGE_CHANGE, () => {
                italian.alpha = Language.isLocale("it") ? 1 : 0.7;
                english.alpha = Language.isLocale("en") ? 1 : 0.7;
                wip.text = Language.getString("wip")
            })
            
        }

        static ratio() {this.width() / 1920}

        static update() {
            // Main loop
        }

        static width() {return this.application.renderer.width}
        static height() {return this.application.renderer.height}

        static add(child) {return this.stage.addChild(child)}
        static dispose(child) {return this.stage.removeChild(child)}
    }

    //###############################################################################
    //
    // ENTRY POINT
    //
    //###############################################################################

    App.init()

})()

/*
//=======================================================
// UTILITIES
//=======================================================

// BY fragmentedreality on Stackoverflow

function getAge(birthday) {
    var today = new Date();
    var thisYear = 0;
    if (today.getMonth() < birthday.getMonth()) {
        thisYear = 1;
    } else if ((today.getMonth() == birthday.getMonth()) && today.getDate() < birthday.getDate()) {
        thisYear = 1;
    }
    var age = today.getFullYear() - birthday.getFullYear() - thisYear;
    return age;
}

function preload_json(name, callback) {
	fetch("src/" + name + ".json").then(response => {
		return response.json();
	}).then(data => {
		DATABASE.register(name, data);
		return callback();
	})
}
*/