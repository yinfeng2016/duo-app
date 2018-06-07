import moment from 'moment';

class Util {
	public convertUpdateTime(timestamp: number): string {
		const diff = this.getNowTimestamp() - timestamp;
		if (diff < 60000) return 'Just Now';
		else if (diff < 3600000) return Math.floor(diff / 60000) + ' Minutes Ago';
		else if (diff < 86400000) return Math.floor(diff / 3600000) + ' Hours Ago';
		else if (diff < 2592000000) return Math.floor(diff / 86400000) + ' Days Ago';
		else return 'Long Time Ago';
	}

	public getNowTimestamp() {
		return moment().valueOf();
	}
}

const util = new Util();
export default util;
