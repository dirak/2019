let generateTexture = (scene, texture_id, width, height, color=0x000000, filled=false) => {
	let tmp = scene.add.graphics();
	tmp.lineStyle(1, color, 1.0);
	tmp.strokeRect(0, 0, width, height);
	tmp.generateTexture(texture_id, width, height);
	tmp.destroy();
}