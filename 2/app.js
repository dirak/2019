var game = new Phaser.Game({
	...CONFIG,
	backgroundColor: '#708090',
	scene: {
		preload: function() {
			this.load.atlas('atlas', 'assets/atlas.png','assets/atlas.json');
		},
		create: function() {
			this.add.sprite(0, 0, 'atlas', '1').setOrigin(0);
		},
		update: function() {

		}
	}
});