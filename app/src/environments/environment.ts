// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//require('dotenv').config();

export const environment = {
	production: false,
	//servidor de pruebas
	/* apiUrl: 'http://10.10.0.7:82/api/',
		dirImgsSubidas: 'http://10.10.0.7:81/',
		pyApiUrl: 'http://10.10.0.7:5005/api/',
		nodeURL: 'http://10.10.0.7:3000/api/',
		recepcionProductoUrl: 'http://10.10.0.7:3003/api/'
		solpedURL: 'http://10.10.0.7:3005/api/'*/

	//servidor de produccion local
	/* apiUrl: "http://10.10.0.2:82/api/",
	dirImgsSubidas: 'http://10.10.0.2:81/' ,
	pyApiUrl: 'http://10.10.0.2:5005/api/',
	nodeURL: 'http://10.10.0.2:3000/api/' */

	//servidor de producción externo
	/* 	apiUrl: 'http://45.181.250.100:82/api/',
		dirImgsSubidas: 'http://45.181.250.100:81/',
		pyApiUrl: 'http://45.181.250.100:5005/api/',
		nodeURL: 'http://45.181.250.100:3000/api/' */

	// ===PRODUCCION
	// apiUrl: 'http://10.10.0.16/backend/public/index.php/api/',
	// dirImgsSubidas: 'http://10.10.0.16/backend/public/subidos/',
	// pyApiUrl: 'http://10.10.0.16:5005/api/',
	// solpedURL: 'http://10.10.0.3:3005/api/',
	// recepcionProductoUrl: 'http://10.10.0.3:3003/api/',
	// AdminAlmacenesUrl: 'http://10.10.0.3:3004/api/'

	// ===PRODUCCION TEST
	apiUrl: 'http://10.10.0.16/backend/public/index.php/api/',
	dirImgsSubidas: 'http://10.10.0.16/backend/public/subidos/',
	pyApiUrl: 'http://10.10.0.16:5005/api/',
	solpedURL: 'http://10.10.0.21:3005/api/',
	recepcionProductoUrl: 'http://10.10.0.3:3003/api/',
	AdminAlmacenesUrl: 'http://10.10.0.21:3004/api/'


	// ===DESARROLLO
	// apiUrl: 'http://localhost/backend/app/public/index.php/api/',
	// dirImgsSubidas: 'http://localhost/backend/app/public/subidos/',
	// pyApiUrl: 'http://localhost:5000/api/',
	// solpedURL: 'http://localhost:3005/api/',
	// recepcionProductoUrl: 'http://localhost:3003/api/',
	// AdminAlmacenesUrl: 'http://localhost:3004/api/',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production modng e because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
