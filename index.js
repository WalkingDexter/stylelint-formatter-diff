const {formatters} = require('stylelint');
const {execFileSync} = require('child_process');
const {resolve} = require('path');

const options = {maxBuffer: 1024 * 1024 * 100};

function getDiffFiles() {
  const commit = process.env.STYLELINT_DIFF_COMMIT || 'HEAD';
  const args = ['diff', '--relative', '--name-only', commit];

  return execFileSync('git', args, options)
    .toString()
    .trim()
    .split('\n')
    .map(path => resolve(path));
}

function getDiffOutput(path) {
  const commit = process.env.STYLELINT_DIFF_COMMIT || 'HEAD';
  const args = ['diff', '--relative', '-U1', commit, '--', resolve(path)];

  return execFileSync('git', args, options)
    .toString()
    .trim()
    .split('\n');
}

function getDiffRanges(path) {
  const regexp = /^@@ -\d+(,\d+)? \+(\d+)(,(\d+))? @@/;
  const output = getDiffOutput(path);
  let ranges = [];

  output.forEach(line => {
    const matches = line.match(regexp);

    if (matches !== null) {
      const count = matches[4] !== undefined ? parseInt(matches[4]) : 1;

      if (count > 0) {
        const start = parseInt(matches[2]);
        ranges.push({start: start, end: (start + count) - 1});
      }
    }
  });

  return ranges;
}

module.exports = function diffFormatter(results, returnValue) {
  let formatter = process.env.STYLELINT_DIFF_FORMATTER || 'string';
  formatter = formatters[formatter] || require(formatter);

  const files = getDiffFiles();
  results = results.filter(result => {
    if (!files.includes(result.source)) {
      return false;
    }

    const ranges = getDiffRanges(result.source);
    result.warnings = result.warnings.filter(warning => ranges.some(range => {
      return warning.line >= range.start && warning.line <= range.end;
    }));

    return true;
  });

  return formatter(results, returnValue);
}
