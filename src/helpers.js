import parse from 'parenthesis';

const clean = (str) => str.replace(/[\w\s!?^]/g, '');
const keepChars = (str) => str.replace(/\W/g, '');

const validateParanthesis = (string) => {
	const onlyPars = clean(string);
	const mirror = { '(': ')',	'{': '}',	'[': ']' };
	const map = [];
	const isOpen = (b) => ['(', '{', '['].includes(b);

	return new Promise((resolve, reject) => {
		onlyPars.split('').forEach((bracket) => {
	  	if (isOpen(bracket)) map.push(bracket);
	  	else if (mirror[map.pop()] !== bracket)
				reject(new Error(`Unexpected token: ${bracket}`));
		});
		if (map.length !== 0) return reject(new Error('Unexpected end of stack'));
		resolve(true);
	});
};

export const parseCreativeInput = async (input) => {
	// F: Forward, B: Backward, L: Left, R: Right, ()^N Repeat whats inside braces N times
	try {
		await validateParanthesis(input);
		const parsed = parse(input);
		const traverseParsed = (subParsed, repeat = 1) => {
			let sum = '';
			if (!subParsed[1]) {
				for (let r = 0; r < repeat; r++) sum += subParsed[0];
				return sum;
			}
			const secondLevelReapeat = parseInt(/\^(\d+)\w*/.exec(subParsed[2])[1]);
			const suffix = /([FBLR]+)/.exec(subParsed[2]);
			const suffixPath = suffix ? suffix[1] : '';
			const secondLevelParsed = traverseParsed(subParsed[1], secondLevelReapeat);
			const parsedText = typeof secondLevelParsed === 'object' ? secondLevelParsed[0] : secondLevelParsed;
			subParsed[0] += parsedText;
			for (let r = 0; r < repeat - 1; r++)
				subParsed[0] += subParsed[0];
			subParsed[0] = keepChars(subParsed[0] + suffixPath);
			return subParsed;
		};
		return traverseParsed(parsed);
	} catch (error) {
		// throw error;
	}
};
