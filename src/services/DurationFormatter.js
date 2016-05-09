const SEC_PER_MIN = 60;
const SEC_PER_HOUR = SEC_PER_MIN * 60;

class DurationFormatter {
    format(duration = 0) {
        const negative = duration < 0;

        let output = '';

        if (negative) {
            output = '-';
            duration *= -1;
        }

        if (duration > SEC_PER_HOUR) {
            output += `${Math.floor(duration / SEC_PER_HOUR)}h `;
            duration %= SEC_PER_HOUR;
        }

        if (duration > SEC_PER_MIN) {
            output += `${Math.floor(duration / SEC_PER_MIN)}m `;
            duration %= SEC_PER_MIN;
        }

        if (duration > 0 || (duration === 0 && (output === '' || output === '-'))) {
            output += `${duration}s`;
        }

        return output.trim();
    }
}
DurationFormatter.$inject = [];

export default DurationFormatter;
