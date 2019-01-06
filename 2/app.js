var tile_width = 32;
var tile_height = 32;

let snap_to_grid = (x, y) => [Math.floor(x/tile_width)*tile_width, Math.floor(y/tile_height)*tile_height];

let possible_directions = {
	'up': ['up', 'cc_left', 'cw_right'],
	'right': ['right', 'cw_down', 'cc_up'],
	'down': ['down', 'cw_left', 'cc_right'],
	'left': ['left', 'cw_up', 'cc_down'],
	'none': ['up', 'right', 'down', 'left']
};

let guide_position = (direction, x, y) => {
	switch(direction) {
		case 'up':
			return [x, y-tile_height];
		case 'right':
			return [x+tile_width, y];
		case 'down':
			return [x, y+tile_height];
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
						let tmp = this.add.sprite(x, y, 'atlas', direction).setOrigin(0);
						tmp.connection = current_connection;
						this.items.add(tmp);

						let tmp_guide = this.add.sprite(...guide_position(direction, x, y), 'guide').setOrigin(0);
						tmp_guide.connection = direction;
						tmp_guide.setInteractive();
						tmp_guide.on('pointerover', () => {
							current_connection = tmp_guide.connection;
						});
						tmp_guide.on('pointerout', () => {
							current_connection = 'none';
						})
						this.guides.add(tmp_guide);
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