import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'copyAsync'
})
export class CopyAsyncPipe implements PipeTransform {

	transform(value: any): any {
		//console.log("recibio", value);
		return value;
	}

}
