var game = new Phaser.Game({
	...CONFIG,
	width: window.innerWidth,
	height: window.innerHeight-100,
	backgroundColor: '#708090',
	scene: {
		preload: function() {

		},
		create: function() {
			document.getElementById('image_upload').addEventListener('change', (test) => {
				let files = document.getElementById('image_upload').files;
				//document.getElementById('test').src = window.URL.createObjectURL(files[0]);
				getBase64(files[0]).then(data => {
					console.log(data);
					this.textures.addBase64('test', data);
				});
			});
			this.textures.on('onload', () => {
				this.spritesheet = this.add.sprite(0, 0, 'test');
				this.spritesheet.setOrigin(0);
				console.log(this.spritesheet);
			});
		},
		update: function() {

		}
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