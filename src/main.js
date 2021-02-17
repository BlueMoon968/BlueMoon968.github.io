//=============================================================================
// BlueMoon Indie Game Developer - Website
// Developed using pixi.js 
//
// * # -- USEFUL LINKS -- #
// * Website: https://aocoder.com/
// * Twitter: https://twitter.com/BlueMoon_Coder
// * Nebula Games Channel: https://www.youtube.com/NebulaGamesStudio
// * BlueMoon Youtube Channel (WIP): https://www.youtube.com/channel/UCYQYuVIQ836FQHLYyLo63Ew?view_as=subscriber
// * Itch.io Page: https://nebula-games.itch.io/
//=============================================================================

//=============================================================================
// CONST
//=============================================================================

const _STAR_NUMBER = 600;
const BLACK = 0x000000
const WHITE = 0xffffff
const LINE_SIZE = 32;

const DEFAULT_STYLE = {
	fontFamily: "MainFont",
	fontSize: 44,
	fill: "white"
}

//=============================================================================
// WINDOW
//=============================================================================

class Window extends PIXI.Sprite {

	constructor(x,y,width,height) {
		super();
		this.locate(x,y)
		this._ww = width;
		this._hh = height;

		this.draw();
		this.createContents();
		// Create Refresh Method
		this.refresh();
	}

	createCursor() {
		this._cursor = new PIXI.Graphics();
		this._cursor.beginFill(WHITE);
		this._cursor.drawPolygon(0,0,this.lineSize,this.lineSize/2,0,this.lineSize);
		this._cursor.scale.set(0.8)
		this._cursor.endFill();
		this.addChild(this._cursor);

		this._cursor.tileMove = (x,y) => {
			// TODO, play sound
			this._cursor.position.set(x*this.lineSize, y*this.lineSize);y
		}

		this._cursor.blink = Ease.ease.add(this._cursor, {alpha:0}, {reverse:true, duration:300, repeat:true, delay:200})
	}

	moveTo(x,y, duration, delay = 0) {
		let ease = Ease.ease.add(this, {x,y}, {ease: "EaseOutQuad", duration:duration, delay:delay})
	}

	locate(x,y) {return this.position.set(x,y)}

	get padding() {return 24}
	get textPadding() {return 4}
	get lineSize() {return LINE_SIZE}

	draw() {
		this.frame = new PIXI.Graphics();
		// Draw Background
		this.frame.beginFill(BLACK);
		this.frame.drawRect(0,0,this._ww,this._hh)
		this.frame.endFill();

		// Draw Foreground
		this.frame.lineStyle(4,WHITE);
		this.frame.drawRect(0,LINE_SIZE + 1, this._ww, 1)
		this.frame.drawRoundedRect(0,0, this._ww, this._hh, 4);
		this.frame.drawRoundedRect(this.padding/2,this.padding/2, this._ww - this.padding, this._hh - this.padding, 2);
		this.addChild(this.frame)
	}

	createContents() {
		this._contents = new PIXI.Container();
		this.addChild(this._contents);

		// This Text Container
		this._textContainer = new PIXI.Container();
		this.addChild(this._textContainer);
	}

	drawText(text, x, y, align = 0, style = DEFAULT_STYLE, noWordWrap = false) {
		let tt = new PIXI.Text(text, style);
		this._textContainer.addChild(tt);
		tt.position.set(x,y)
		tt.anchor.set(align)
		if(!!noWordWrap) {return;}
		tt.style.wordWrap = true;
		tt.style.wordWrapWidth = this.width - this.padding*2;
	} 

	update(dt) {
		for(let child of this._contents.children) {
			child.update(dt);
		}
	}

	refresh() {

	}
}

//=============================================================================
// COMMAND WINDOW
//=============================================================================

class Profile_Window extends Window {

	refresh() {
		super.refresh();
	}

}

//=============================================================================
// PARTICLE
//=============================================================================

class Star extends PIXI.Sprite {

	constructor(x, y, r, xSpeed, ySpeed) {
		super();
		this.circle = new PIXI.Graphics();
		this.addChild(this.circle);
		this.x = x; 
		this.y = y;
		this.radius = r;
		this.xSpeed = xSpeed;
		this.ySpeed = ySpeed;
		this.visible = false;
		this.alpha = 0.8
		this.draw()
	}

	update(delta, x, y) {
		if(!this.visible) {this.visible = true}
		this.x += this.xSpeed * delta;
		this.y += this.ySpeed * delta;
		this.x += x !== undefined ? x : 0;
		this.y += y !== undefined ? y : 0;
		if(this.x < this.radius || this.x > window.innerWidth - this.radius) {this.xSpeed = -this.xSpeed}
		if(this.y < this.radius || this.y > window.innerHeight - this.radius) {this.ySpeed = -this.ySpeed}
	}

	draw() {
		this.circle.beginFill(0xffffff);
		this.circle.drawCircle(0,0,this.radius);
		this.circle.endFill()
	}
}

//=============================================================================
// PIXI APP
//=============================================================================

class Main {

	get width() {return 1920;}
	get height() {return 1080;}
	get stage() {return this.app.stage;}
	get renderer() {return this.renderer;}
	get ticker() {return this.app.ticker}

	constructor() {
		this.app = new PIXI.Application(this.width, this.height, {
			backgroundColor: 0x000000,
			roundPixels: true,
			resolution: window.devicePixelRatio || 1,
			autoResize: true
		})
		this.app.view.id = "pixi-canvas";
		// Append the canvas
		document.body.appendChild(this.app.view);
		this.processLoader();
	}

	resizeEvent() {
        const w = Math.max(window.innerWidth, document.documentElement.clientWidth);
        const h = Math.max(window.innerHeight, document.documentElement.clientHeight);
        
        const scaleFactor = Math.min(
            w / this.width,
            h / this.height
        );

        const newWidth = Math.ceil(this.width * scaleFactor);
        const newHeight = Math.ceil(this.height * scaleFactor);

        this.app.renderer.resize(newWidth, newHeight);
        this.app.stage.scale.set(scaleFactor);
	}

	initParticles() {
		this._lifetime = 0;
		this._particleContainer = new PIXI.Container();
		this.stage.addChild(this._particleContainer);

		for(let i = 0; i < _STAR_NUMBER; i++) {
			let particle = new Star(Math.random() * this.width, Math.random() * this.height, Math.random(), (Math.random() * 3) - 1.5, (Math.random() * 3) - 1.5);
			this._particleContainer.addChild(particle);
		}
	}

	createWindows() {
		this._windowContainer = new PIXI.Container();
		this.stage.addChild(this._windowContainer);

		// Create Windows
		this._profile = new Profile_Window(100,100,200,200);
		this._windowContainer.addChild(this._profile);
	}

	createFooter() {
		this._footer = new PIXI.Text("©Luca Mastroianni - BlueMoon 2021:e.g.", DEFAULT_STYLE);
		this._footer.style.fontSize = 16;
		this._footer.position.set(this.width / 2, this.height - this._footer.height);
		this._footer.anchor.set(0.5);
		this.stage.addChild(this._footer)
	}

	updateWindows(dt) {
		for(let win of this._windowContainer.children) {
			win.update(dt);
		}
	}

	updateParticles(dt) {
		let sin = Math.sin(this._lifetime / 350)
		let cos = Math.cos(this._lifetime / 350)
		let speed = 0.1
		let x = sin * (speed*dt);
		let y = cos * (speed*dt);
		for(let star of this._particleContainer.children) {
			star.update(dt, x, y);
		}
		this._lifetime = (this._lifetime + 1) % 545;
	}

	update(dt) {
		this.updateParticles(dt);
		this.updateWindows(dt);
	}

	processLoader() {
		// Process Loading
		PIXI.loader.load(() => {
			// Add all the things to load...
			this.initParticles();
			this.createWindows();
			this.createFooter();
			// Finish Loading
			this.ticker.add(this.update, this);
			this.resizeEvent();
			window.addEventListener("resize", this.resizeEvent.bind(this));
		})
	}
}

//=============================================================================
// ENTRY POINT
//=============================================================================

window.onload = () => {
	window.MAIN = new Main();
}