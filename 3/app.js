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
	/*
			collideTop: false,
			collideBottom: false,
	*/
	preload() {
		this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json')
		this.emitter_json = {
			frame: [ 'red', 'green' ],
			x: 600,
			y: 400
		}
		document.querySelectorAll('.emitter > .default').forEach(node => {
			node.addEventListener('change', () => {
				let value = node.value
				if(value === '') {
					delete this.emitter_json[node.name]
					this.makeEmitter()
					return
				}
				if(node.type === 'number') value = parseFloat(value)
				this.emitter_json[node.name] = value
				this.makeEmitter()
			})
		})
		document.querySelectorAll('.emitter > .advanced').forEach(node => {
			node.addEventListener('change', () => {
				let value = node.value
				if(value === '') {
					delete this.emitter_json[node.id.split('_')[0]]
					this.makeEmitter()
					return
				}
				if(node.type === 'number') value = parseFloat(value)
				if(typeof this.emitter_json[node.id.split('_')[0]] !== "object") {
					this.emitter_json[node.id.split('_')[0]] = [...node.parentNode.querySelectorAll('.advanced')]
					.reduce((acc, node) => {
						let value = node.value
						if(node.type === 'number') value = parseFloat(value)
						acc[node.name] = value
						return acc
					}, {})
				} else {
					this.emitter_json[node.id.split('_')[0]][node.name] = value
				}
				this.makeEmitter()
			})
		})
		document.querySelectorAll('.toggle').forEach(node => {
			let toggleEl = node.parentNode.nextElementSibling
			toggleEl.style.display = "none"
			node.addEventListener('click', () => {
				if(toggleEl.style.display === "none") {
					toggleEl.style.display = "block"
					node.classList.toggle('fa-plus-square')
					node.classList.toggle('fa-minus-square')
				}
				else {
					toggleEl.style.display = "none"
					node.classList.toggle('fa-minus-square')
					node.classList.toggle('fa-plus-square')
				}
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
		console.log(this.emitter_json)
		if(this.particles) this.particles.destroy()
		this.particles = this.add.particles('flares')
		this.particles.createEmitter(this.emitter_json)
	}
}

var game = new Phaser.Game({
	...CONFIG,
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: '#000',
	scene: [EmitterScene]
});
