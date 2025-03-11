## About

Removes non-diff violations from [Stylelint](https://github.com/stylelint/stylelint) results.

## Installation

```bash
npm install --save-dev stylelint-formatter-diff
```

## Usage

Check current changes:
```bash
npx stylelint "**/*.css" --custom-formatter=stylelint-formatter-diff
```

Check changes relative to the `main` branch:
```bash
export STYLELINT_DIFF_COMMIT=main
npx stylelint "**/*.css" --custom-formatter=stylelint-formatter-diff
```

Check changes relative to a specific commit:
```bash
export STYLELINT_DIFF_COMMIT=3e76bcf
npx stylelint "**/*.css" --custom-formatter=stylelint-formatter-diff
```

Format results with a non-default formatter (`string`):
```bash
export STYLELINT_DIFF_FORMATTER=verbose
npx stylelint "**/*.css" --custom-formatter=stylelint-formatter-diff
```
