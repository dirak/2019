var tile_width = 32;
var tile_height = 32;

const DEBUG = 0;
let ALPHA = 1;
if(DEBUG)ALPHA = 1;
else ALPHA = 0.01;

let snap_to_grid = (x, y) => [Math.floor(x/tile_width)*tile_width, Math.floor(y/tile_height)*tile_height];

let test_path = new Phaser.Curves.Path();

let possible_directions = {
	'up': ['up', 'cw_right', 'cc_left'],
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
	'starts_up': ['up', 'cc_up', 'cw_up'],
	'starts_right': ['right', 'cc_right', 'cw_right'],
	'starts_down': ['down', 'cc_down', 'cw_down'],
	'starts_left': ['left', 'cc_left', 'cw_left'],
	'starts_cc_up': ['right', 'cc_right', 'cw_right'],
	'starts_cw_up': ['left', 'cc_left', 'cw_left'],
	'starts_cc_right': ['down', 'cc_down', 'cw_down'],
	'starts_cw_right': ['up', 'cc_up', 'cw_up'],
	'starts_cc_down': ['left', 'cc_left', 'cw_left'],
	'starts_cw_down': ['right', 'cc_right', 'cw_right'],
	'starts_cc_left': ['up', 'cc_up', 'cw_up'],
	'starts_cw_left': ['down', 'cc_down', 'cw_down'],
};

let guide_position = (direction, x, y) => {
	switch(direction) {
		case 'cc_up':
		case 'cw_up':
		case 'starts_down':
		case 'starts_cw_left':
		case 'starts_cc_right':
		case 'up':
			return [x, y-tile_height];
		case 'cc_right':
		case 'cw_right':
		case 'starts_left':
		case 'starts_cw_up':
		case 'starts_cc_down':
		case 'right':
			return [x+tile_width, y];
		case 'cc_down':
		case 'cw_down':
		case 'starts_up':
		case 'starts_cw_right':
		case 'starts_cc_left':
		case 'down':
			return [x, y+tile_height];
		case 'cc_left':
		case 'cw_left':
		case 'starts_right':
		case 'starts_cw_down':
		case 'starts_cc_up':
		case 'left':
			return [x-tile_width, y];
	}
}

let get_curve = (direction, x, y) => {
	console.log(direction);
	switch(direction) {
		case 'up':
			return new Phaser.Curves.Line(
				new Phaser.Math.Vector2(x + tile_width/2, y + tile_height),
				new Phaser.Math.Vector2(x + tile_width/2, y)
			);
		case 'down':
			return new Phaser.Curves.Line(
				new Phaser.Math.Vector2(x + tile_width/2, y),
				new Phaser.Math.Vector2(x + tile_width/2, y + tile_height)
			);
		case 'right':
			return new Phaser.Curves.Line(
				new Phaser.Math.Vector2(x, y + tile_height/2),
				new Phaser.Math.Vector2(x + tile_width, y + tile_height/2)
			);
		case 'left':
			return new Phaser.Curves.Line(
				new Phaser.Math.Vector2(x + tile_width, y + tile_height/2),
				new Phaser.Math.Vector2(x, y + tile_height/2),
			);
		case 'cc_left':
			return new Phaser.Curves.CubicBezier(
				new Phaser.Math.Vector2(x + tile_width/2, y + tile_height),
				new Phaser.Math.Vector2(x + tile_width, y + tile_height/2),
				new Phaser.Math.Vector2(x + tile_width/2, y + tile_height/2),
				new Phaser.Math.Vector2(x, y + tile_height/2)
      );
    case 'cc_down':
			return new Phaser.Curves.QuadraticBezier(
				new Phaser.Math.Vector2(x + tile_width, y + tile_height/2),
				new Phaser.Math.Vector2(x, y),
				new Phaser.Math.Vector2(x + tile_width/2, y + tile_height)
      );
    case 'cc_up':
			return new Phaser.Curves.QuadraticBezier(
				new Phaser.Math.Vector2(x, y + tile_height/2),
				new Phaser.Math.Vector2(x + tile_width, y + tile_height),
				new Phaser.Math.Vector2(x + tile_width/2, y)
      );
    case 'cc_right':
			return new Phaser.Curves.QuadraticBezier(
				new Phaser.Math.Vector2(x + tile_width/2, y),
				new Phaser.Math.Vector2(x, y + tile_height),
				new Phaser.Math.Vector2(x + tile_width, y + tile_height/2)
			);
		case 'cw_right':
			return new Phaser.Curves.QuadraticBezier(
				new Phaser.Math.Vector2(x + tile_width/2, y + tile_height),
				new Phaser.Math.Vector2(x, y),
				new Phaser.Math.Vector2(x + tile_width, y + tile_height/2)
			);
		case 'cw_down':
			return new Phaser.Curves.QuadraticBezier(
				new Phaser.Math.Vector2(x, y + tile_height/2),
				new Phaser.Math.Vector2(x + tile_width, y),
				new Phaser.Math.Vector2(x + tile_width/2, y + tile_height)
			);
		case 'cw_left':
			return new Phaser.Curves.QuadraticBezier(
				new Phaser.Math.Vector2(x + tile_width/2, y),
				new Phaser.Math.Vector2(x + tile_width, y + tile_height),
				new Phaser.Math.Vector2(x, y + tile_height/2)
      );
    case 'cw_up':
			return new Phaser.Curves.QuadraticBezier(
				new Phaser.Math.Vector2(x + tile_width, y + tile_height/2),
				new Phaser.Math.Vector2(x, y + tile_height),
				new Phaser.Math.Vector2(x + tile_width/2, y)
			);
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
      this.load.image('ball', 'assets/ball.png');
			generateTexture(this, 'guide', tile_width, tile_height);
			this.items = this.add.group();
			this.guides = this.add.group();

			this.setSelection = (connection, direction) => {
				current_connection = connection;
				current_direction = direction;
				this.selection.setFrame(possible_directions[current_connection][current_direction]);
			}
		},
		create: function() {
			this.selection = this.add.sprite(0, 0, 'atlas', 'up').setOrigin(0).setAlpha(0.5);
      if(DEBUG) {
        this.debug_graphic = this.add.graphics();
        this.debug_graphic.lineStyle(1, 0xFF00FF, 1.0);
        this.debug_graphic.setX(0).setY(0);
        this.debug_graphic.setDepth(2);
      }
			this.input.keyboard.on('keyup_R', () => {
				current_direction++;
				current_direction %= possible_directions[current_connection].length;
				this.selection.setFrame(possible_directions[current_connection][current_direction]);
			});

      this.input.keyboard.on('keyup_S', () => {
        let start = test_path.curves[0].getPoint(0);
        this.follower = this.add.follower(test_path, start.x, start.y, 'ball' );
        let number_of_curves = test_path.curves.length;
        this.follower.startFollow({
          duration: number_of_curves * 1000,
          rotateToPath: false,
          positionOnPath: true,
          from: 0,
          to: 1,
        });
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
            item.path = get_curve(direction, x, y);
            test_path.add(item.path);
						if(DEBUG) {
							item.path.draw(this.debug_graphic);
						}
						this.items.add(item);
						//
						//add the guides for the new item
						let forward_guide = this.add.sprite(...guide_position(direction, x, y), 'guide')
							.setOrigin(0)
							.setTintFill(0x45FF45)
							.setAlpha(ALPHA);
						forward_guide.connection = direction;
						forward_guide.setInteractive();
						forward_guide.on('pointerout', () => {
							this.setSelection('none', 0);
						});
						forward_guide.on('pointerover', () => {
							this.setSelection(forward_guide.connection, 0);
						});
						this.guides.add(forward_guide);

					let starts_guide = this.add.sprite(...guide_position(`starts_${direction}`, x, y), 'guide')
						.setOrigin(0)
						.setTintFill(0xFF4545)
						.setAlpha(ALPHA);
						starts_guide.connection = `starts_${direction}`;
						starts_guide.setInteractive();
						starts_guide.on('pointerout', () => {
						this.setSelection('none', 0);
					});
					starts_guide.on('pointerover', () => {
						this.setSelection(starts_guide.connection, 0);
					});
					this.guides.add(starts_guide);
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