# Duplicate Code Detector

Duplicate Code Detector is a powerful tool designed to identify and analyze duplicate code across JavaScript, TypeScript, JSX, and TSX files. It supports three types of analysis: Exact, Near, and Structural duplicate detection.

## Demo

[Click here to watch the demo video](https://drive.google.com/file/d/1Q95uzvOlO5yWKFB62utgxLdXOqZM3a27/view?usp=sharing)

---

## Features

- **Exact Duplicate Detection**: Finds identical code blocks across files.
- **Near Duplicate Detection**: Identifies code blocks that are similar based on a configurable similarity threshold.
- **Structural Duplicate Detection**: Detects functionally similar code by normalizing the code structure.

## Installation

1. Clone the repository

  

2. Need to have node installed and then Install dependencies:

   ```bash
   npm install
   ```

## Usage

### Command-Line

2. Run the tool by executing the following command:

   ```bash
   npm start
   ```
2. Select the JS/TS you want to analyze.
3. Select the analysis type: Exact, Near, or Structural.


## Configuration

- **Near Duplicate Threshold**: You can configure the similarity threshold for near duplicate detection. The default is `0.8`.

## Output

The results are displayed in JSON format, categorized by analysis type:

- **Exact Duplicates**: Lists identical functions and their file locations.
- **Near Duplicates**: Lists similar functions with similarity scores and file locations.
- **Structural Duplicates**: Lists normalized functions and their corresponding file locations.



