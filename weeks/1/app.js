var tile_width = 32;
var tile_height = 32;
var x_padding = 0;
var y_padding = 0;
var x_offset = 0;
var y_offset = 0;

var json = {};

var game = new Phaser.Game({
	...CONFIG,
	width: window.innerWidth-200,
	height: window.innerHeight-100,
	backgroundColor: '#CCCCCC',
	scene: {
		preload: function() {
			console.log(this);
			this.input.mouse.disableContextMenu();
			this.generateBox = function(width, height) {
				this.textures.remove('box');
				let tmp = this.add.graphics();
				tmp.lineStyle(1,0xfc0fc0, 1.0);
				tmp.strokeRect(0, 0, width, height);
				tmp.generateTexture('box', width, height);
				tmp.destroy();
			}

			this.drawBoxes = () => {
				if(this.spritesheet) this.spritesheet.destroy(true);
				this.boxes.clear(true, true);
				this.spritesheet = this.add.sprite(0, 0, 'test').setOrigin(0);
				let columns = Math.floor(this.spritesheet.displayWidth / tile_width);
				let rows = Math.floor(this.spritesheet.displayHeight / tile_height);
				for(let i = 0; i < columns; i++) {
					for(let j = 0; j < rows; j++) {
						let box = this.add.sprite(x_offset + i*(tile_width+x_padding), y_offset + j*(tile_height+y_padding), 'box').setOrigin(0);
						box.sprite_index = `${i}_${j}`;
						box.sprite_name = `${i}_${j}`;
						box.setInteractive();
						box.on('pointerdown', (pointer) => {
							switch (pointer.buttons) {
								case 1:
									let menu = document.getElementById('sprite-menu');
									let menu_clone = menu.cloneNode(true);
									menu.parentNode.replaceChild(menu_clone, menu);
									menu_clone.style.display = 'block';
									document.getElementById('sprite-name').value = box.sprite_name;
									document.getElementById('sprite-name').addEventListener('change', () => {
										box.sprite_name = document.getElementById('sprite-name').value;
									});
									break;
								case 2:
									this.boxes.remove(box, true, true);
									break;
								default:
									break;
							}
							
						});
						this.boxes.add(box);
					}
				}
			}

			this.generateJSON = () => {
				return {
					frames: 
						this.boxes.getChildren().map(box => {
							return {
								filename: `${box.sprite_name}`,
								frame: {
									x: box.x,
									y: box.y,
									w: tile_width,
									h: tile_height
								},
								sourceSize: {
									w: tile_width,
									h: tile_height
								},
								rotated: false,
								trimmed: false
							}
						})
				}
			}

			this.generateBox(tile_width, tile_height);
			this.spritesheet = null;
		},

		create: function() {
			this.boxes = this.add.group();

			document.getElementById('image_upload').addEventListener('change', () => {
				let files = document.getElementById('image_upload').files;
				getBase64(files[0]).then(data => {
					this.textures.remove('test');
					this.textures.addBase64('test', data);
				});
			});
			document.getElementById('width-input').addEventListener('change', (event) => {
				tile_width = parseInt(document.getElementById('width-input').value);
				this.generateBox(tile_width, tile_height);
				if(this.spritesheet) this.drawBoxes();
			});

			document.getElementById('height-input').addEventListener('change', (event) => {
				tile_height = parseInt(document.getElementById('height-input').value);
				this.generateBox(tile_width, tile_height);
				if(this.spritesheet) this.drawBoxes();
			});

			document.getElementById('xpadding-input').addEventListener('change', (event) => {
				x_padding = parseInt(document.getElementById('xpadding-input').value);
				if(this.spritesheet) this.drawBoxes();
			});

			document.getElementById('ypadding-input').addEventListener('change', (event) => {
				y_padding = parseInt(document.getElementById('ypadding-input').value);
				if(this.spritesheet) this.drawBoxes();
			});

			document.getElementById('xoffset-input').addEventListener('change', (event) => {
				x_offset = parseInt(document.getElementById('xoffset-input').value);
				if(this.spritesheet) this.drawBoxes();
			});

			document.getElementById('yoffset-input').addEventListener('change', (event) => {
				y_offset = parseInt(document.getElementById('yoffset-input').value);
				if(this.spritesheet) this.drawBoxes();
			});

			document.getElementById('generate').addEventListener('click', (event) => {
				downloadFile('test.json', JSON.stringify(this.generateJSON(), null, 2), 'text/json');
			});
			this.textures.on('onload', () => {
				console.log("texture loaded");
				this.drawBoxes();
			});
		},
		update: function() {

		},
	}
});

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}