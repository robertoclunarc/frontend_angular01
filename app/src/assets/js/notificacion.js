function enviarNotificacion(header, mensaje, iconPath, timeout) {
	
	Push.Permission.request(onGranted(header, mensaje, iconPath, timeout), onDenied);
	
	/*Notification.requestPermission(function(result) {
	if (result === 'denied') {
		console.log('Permission wasn\'t granted. Allow a retry.');
		return;
	} else if (result === 'default') {
		console.log('The permission request was dismissed.');
		return;
	}
	console.log('Permission was granted for notifications');
	});*/
	
    /*Push.create(header, {
		body: mensaje,
		icon: iconPath,
		timeout: timeout,
		onClick: function () {
			window.focus();
			this.close();
		}
	});*/
}

function onGranted(header, mensaje, iconPath, timeout) {
	
	console.log('Permission was granted for notifications');
	crearNotificacion(header, mensaje, iconPath, timeout);
}

function onDenied() {
	console.log('Permiso Denegado.');
}

function crearNotificacion(header, mensaje, iconPath, timeout){
	
		Push.create(header, {
		body: mensaje,
		icon: iconPath,
		timeout: timeout,
		onClick: function () {
			window.focus();
			this.close();
		}
	});
}


$(function() {
    alert('Hello, custom js');
});