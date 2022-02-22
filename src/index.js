const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec');

function Escape(text)
{
	return text + '\"';
}

async function DistributeAppCenter(args)
{
	console.log(args);
	await exec.exec('appcenter', args);
}

async function Run()
{
	try {
		var args = [
			'distribute',
			'release',
			'--token', core.getInput('token'),
			'-f', core.getInput('path'),
			'-a', core.getInput('app'),
			'-n', github.context.runNumber
		];

		if (core.getBooleanInput('mandatory')) {
			args.push('--mandatory');
		}

		if (core.getBooleanInput('silent')) {
			args.push('--silent');
		}

		if (core.getInput('group') !== '') {
			args.push('-g');
			args.push(core.getInput('group'));
		}

		if (core.getInput('release_notes') !== '') {
			args.push('-R')

			const temp = './release_notes.txt';
			await exec.exec(`echo ${core.getInput('release_notes')} >> ${temp}`);
			args.push(temp);
		}

		await DistributeAppCenter(args);
	} catch (ex) {
		core.setFailed(ex.message);
	}
}

Run();