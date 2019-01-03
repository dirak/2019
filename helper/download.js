function downloadFile(filename, data, protocol="text/plain") {
	let element = document.createElement('a');
	element.setAttribute('href', `data:${protocol};charset=utf-8,${encodeURIComponent(data)}`);
	console.log(`data:${protocol};charset=utf-8,${encodeURIComponent(data)}`);
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}