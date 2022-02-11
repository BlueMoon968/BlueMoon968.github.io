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

    const SILVER = 0xcfc9d1
    const MID_BLUE = 0x424572
    const DARK_BLUE = 0x2f2d3b
    const WHITE = 0xffffff

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
            this.locale = localStorage.getItem(Language.LOCAL_STORAGE_KEY) || "en";
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

        static off(e, f) {
            if(!!this._events[e]) {
                if(this._events.indexOf(f) > -1) {
                    this._events.splice(this._events.indexOf(f), 1)
                }
                
            }
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
    // TEXT
    //
    //###############################################################################

    class Text extends PIXI.Text {

        static DEFAULT_STYLE = {
            fontFamily: "Oswald",
            fontSize: 28,
            fill: WHITE
        }

        constructor(key, style = "DEFAULT_STYLE") { 
            super(Language.getString(key),Text[style])
            this._key = key
            Language.on(Language.LANGUAGE_CHANGE, this.updateLocalization.bind(this))
        }

        updateLocalization() {this.text = Language.getString(this._key)}

        dispose() {
            Language.off(Language.LANGUAGE_CHANGE, this.updateLocalization.bind(this))
            this.parent.removeChild(this)
        }

        set fontSize(value) {this.style.fontSize = value}
        get fontSize() {return this.style.fontSize}
    }

    //###############################################################################
    //
    // NAVBAR
    //
    //###############################################################################

    class Navbar extends PIXI.Container {

        constructor() {
            super()
            this._pen = new PIXI.Graphics()
            this.addChild(this._pen)
            this.drawBackground()
            this.drawHeader()
            this.addCommands()
        }

        drawBackground() {
            const HEIGHT = Math.floor(App.height() / 15)
            this._pen.beginFill(DARK_BLUE,0.5)
            this._pen.drawRect(0,0,App.width(),HEIGHT)
            this._pen.endFill()       
            const THINLINE = 2 
            this._pen.beginFill(MID_BLUE)
            this._pen.drawRect(0,0,App.width(),THINLINE)
            this._pen.drawRect(0,HEIGHT - THINLINE,App.width(),THINLINE)
            this._pen.endFill()
        }

        drawHeader() {
            let nebula = new Text("header")
            const MARGIN = 24
            nebula.fontSize = 36
            nebula.anchor.set(0,0.5)
            nebula.position.set(MARGIN*10, this.height / 2)
            this.addChild(nebula)
        }

        addCommands() {
            const COMMANDS = ["home", "projects", "about"]
            for(let i = 0; i < COMMANDS.length; i++) {
                const command = COMMANDS[i]
                let text = new Text(command)
                text.fontSize = 18
                text.anchor.y = 0.5
                text.buttonMode = true
                text.interactive = true
                let ww = i === 0 ? Math.floor(this.width / 4) : this.children[this.children.length - 1].x + this.children[this.children.length - 1].width + Math.floor(this.width / 24)
                text.position.set(ww, this.height / 2)
                this.addChild(text)
            }
        }
    }

    //###############################################################################
    //
    // FOOTER
    //
    //###############################################################################

    class Footer extends PIXI.Container {

        constructor() {
            super()
            this._pen = new PIXI.Graphics()
            this.addChild(this._pen)
            this.drawFooter()
        }

        drawFooter() {
            const THINLINE = 3
            this._pen.beginFill(MID_BLUE)
            this._pen.drawRect(0,0,App.width(),THINLINE)
            this._pen.endFill()
            this._pen.beginFill(DARK_BLUE)
            this._pen.drawRect(0,THINLINE,App.width(),Math.floor(App.height() / 10))
            this._pen.endFill()

            // Add texts
            const disclaimer = new Text("disclaimer")
            disclaimer.fontSize = 24
            const MARGIN = 24
            disclaimer.position.set(MARGIN*10, MARGIN)
            this.addChild(disclaimer)
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
            Language.init(() => {
                document.body.appendChild(this.application.view);
                this.initElements();
                this.ticker.add(this.update, this);
            })
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
            
            const english = new PIXI.Text("ENGLISH", this.defaultStyle(18));
            english.interactive = true;
            english.on("pointerdown", () => {
                Language.switchLanguage("en")
            })
            english.alpha = Language.isLocale("en") ? 1 : 0.7;
            english.position.set(italian.x + english.width + 5,italian.y);
            english.buttonMode = true
            

            // TEMPORARY
            const wip = new Text("wip")
            wip.fontSize = 48
            this.add(wip);
            wip.anchor.set(0.5)
            wip.position.set(this.width()/2,this.height()/2)

            Language.on(Language.LANGUAGE_CHANGE, () => {
                italian.alpha = Language.isLocale("it") ? 1 : 0.7;
                english.alpha = Language.isLocale("en") ? 1 : 0.7;
            })

            // FOOTER
            const footer = new Footer()
            footer.position.set(0, this.height() - footer.height)
            this.add(footer)

            const navbar = new Navbar()
            this.add(navbar)
            this.add(italian)
            this.add(english)
            
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