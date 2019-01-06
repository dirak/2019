var tile_width = 32;
var tile_height = 32;

const DEBUG = 1;

let snap_to_grid = (x, y) => [Math.floor(x/tile_width)*tile_width, Math.floor(y/tile_height)*tile_height];

let possible_directions = {
	'up': ['up', 'cc_left', 'cw_right'],
	'right': ['right', 'cw_down', 'cc_up'],
	'down': ['down', 'cw_left', 'cc_right'],
	'left': ['left', 'cw_up', 'cc_down'],
	'none': ['up', 'right', 'down', 'left'],
	'cc_up': ['up', 'cc_left', 'cw_right'],
	'cw_up': ['up', 'cc_left', 'cw_right'],
	'cc_right': ['right', 'cw_down', 'cc_up'],
	'cw_right': ['right', 'cw_down', 'cc_up'],
	'cc_down': ['down', 'cw_left', 'cc_right'],
	'cw_down': ['down', 'cw_left', 'cc_right'],
	'cc_left': ['left', 'cw_up', 'cc_down'],
	'cw_left': ['left', 'cw_up', 'cc_down'],
};

let guide_position = (direction, x, y) => {
	switch(direction) {
		case 'cc_up':
		case 'cw_up':
		case 'up':
			return [x, y-tile_height];
		case 'cc_right':
		case 'cw_right':
		case 'right':
			return [x+tile_width, y];
		case 'cc_down':
		case 'cw_down':
		case 'down':
			return [x, y+tile_height];
		case 'cc_left':
		case 'cw_left':
		case 'left':
			return [x-tile_width, y];
	}
}

let current_direction = 0;
let current_connection = 'none';

var game = new Phaser.Game({
	...CONFIG,
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: '#708090',
	scene: {
		preload: function() {
			this.input.mouse.disableContextMenu();
			this.load.atlas('atlas', 'assets/atlas.png','assets/atlas.json');
			generateTexture(this, 'guide', tile_width, tile_height);

			this.items = this.add.group();
			this.guides = this.add.group();
		},
		create: function() {
			this.selection = this.add.sprite(0, 0, 'atlas', 'up').setOrigin(0).setAlpha(0.5);

			this.input.keyboard.on('keyup_R', () => {
				current_direction++;
				current_direction %= possible_directions[current_connection].length;
				this.selection.setFrame(possible_directions[current_connection][current_direction]);
			});

			this.input.on('pointermove', (pointer) => {
				[x, y] = snap_to_grid(pointer.x, pointer.y);
				this.selection.setX(x);
				this.selection.setY(y);
			});

			this.input.on('pointerdown', (pointer) => {
				switch (pointer.buttons) {
					case 1:
						[x, y] = snap_to_grid(pointer.x, pointer.y);
						let direction = possible_directions[current_connection][current_direction];
						//add the new item
						let item = this.add.sprite(x, y, 'atlas', direction).setOrigin(0);
						item.connection = current_connection;
						this.items.add(item);
						//
						//add the guides for the new item
						let forward_guide = this.add.sprite(...guide_position(direction, x, y), 'guide')
							.setOrigin(0)
							.setTintFill(0x45FF45)
							.setAlpha(DEBUG);
						forward_guide.connection = direction;
						forward_guide.setInteractive();
						forward_guide.on('pointerout', () => {
							current_connection = 'none';
							current_direction = 0;
							this.selection.setFrame(possible_directions[current_connection][current_direction]);
						});
						forward_guide.on('pointerover', () => {
							current_connection = forward_guide.connection;
							current_direction = 0;
							this.selection.setFrame(possible_directions[current_connection][current_direction]);
						});
						this.guides.add(forward_guide);
						//
						break;
					case 2:

						break;
				}
			});
		},
		update: function() {

		}
	}
});