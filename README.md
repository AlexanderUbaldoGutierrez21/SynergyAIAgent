# Synergy AI Agent

## Description

This project is an AI-powered agent designed to process and analyze energy-related data. It integrates with Google Vision API for image processing, performs solar energy calculations, extracts data from various sources, and transforms kilowatt-hour (kWh) data for analysis.

## Features

- **Data Extraction**: Extract data from multiple sources using `Extract_Data.js`.
- **Google AI Integration**: Utilize Google AI APIs via `GoogleAI_API.js`.
- **Solar Calculations**: Perform solar energy calculations with `Solar_Calculation.js`.
- **Data Transformation**: Transform kWh data using `Transform_kWh.js`.
- **API Configuration**: Securely manage Google Vision API credentials.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd SynergyAIAgent
   ```

2. Install dependencies (if any):
   ```
   npm install
   ```

## Setup

### API Credentials

This project requires a Google Cloud service account key for the Vision API.

1. Create a service account in Google Cloud Console and download the JSON key file.
2. Copy the example file to the required location:
   ```
   cp Synergy_GoogleVisionAPI.example.json Synergy_GoogleVisionAPI.json
   ```
3. Edit `Synergy_GoogleVisionAPI.json` and replace the placeholder values with your actual credentials:
   - `project_id`: Your Google Cloud project ID
   - `private_key_id`: Your private key ID
   - `private_key`: Your private key (including the BEGIN and END markers)
   - `client_email`: Your service account email
   - `client_id`: Your client ID

**Important**: Never commit `Synergy_GoogleVisionAPI.json` to version control. Ensure it is added to `.gitignore`.

## Usage

Run the JavaScript files as needed for your specific tasks. For example:

- To extract data: `node Extract_Data.js`
- To perform solar calculations: `node Solar_Calculation.js`
- To transform kWh data: `node Transform_kWh.js`

Refer to the individual script files for detailed usage instructions.

## Contributing

Contributions are welcome. Please ensure that sensitive information is not included in commits.

## License

[Add your license here]