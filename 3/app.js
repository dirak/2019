var menu_offset = 300
var tile_width = 32
var tile_height = 32
var x_padding = 0
var y_padding = 0
var x_offset = 0
var y_offset = 0

class EmitterScene extends Phaser.Scene {
	constructor() {
		super({key: "Emitter"})
	}
	preload() {
		this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json')
		this.emitter_json = {
			frame: [ 'red', 'green' ],
			x: 400,
			y: 400,
			lifespan: 4000,
			angle: { min: 225, max: 315 },
			speed: { min: 300, max: 500 },
			scale: { start: 0.6, end: 0 },
			gravityY: 300,
			bounce: 0.9,
			bounds: { x: 250, y: 0, w: 350, h: 0 },
			collideTop: false,
			collideBottom: false,
			blendMode: 'ADD'
		}
		document.querySelectorAll('.emitter').forEach(node => {
			node.addEventListener('change', () => {
				let value = node.value
				console.log('type',node.type)
				console.log('value', node.value)
				console.log('name', node)
				if(node.type === 'number') value = parseInt(value)
				this.emitter_json[node.name] = value
				this.makeEmitter()
			})
		})
		document.querySelector('.canvas-bg').addEventListener('change', () => {
			this.cameras.main.setBackgroundColor(document.querySelector('.canvas-bg').value)
		})
	}

	create() {
		this.particles = null
		this.makeEmitter()
	}

	update() {

	}

	makeEmitter() {
		if(this.particles) this.particles.destroy()
		this.particles = this.add.particles('flares')
		this.particles.createEmitter(this.emitter_json)
	}
}

var game = new Phaser.Game({
	...CONFIG,
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: '#CCC',
	scene: [EmitterScene]
});
