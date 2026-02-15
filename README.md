# Synergy AI Agent
This project is an AI-powered agent designed to process and analyze energy-related data. It integrates with Google Vision API for processing energy bills, extracts kilowatt-hour (kWh) data, performs calculations to estimate solar panels deployment, transforms data format, and provide users with a comprehensive analysis. It features and tech stack were selected to ensure a no-cost automation and the use of free credits, perfect for small businesses or startups.

## Features and Recommended Dependencies
- **PipeDream**: iPaaS (Integration Platform as a Service / Orchestration)
- **Gravity Forms (WordPress)**: Webhook Trigger 
- **Data Extraction**: Extract Data from PDF using `Extract_Data.js`.
- **Google AI Integration**: Utilize Google AI APIs via `GoogleAI_API.js`.
- **Solar Calculations**: Solar Energy Calculations with `Solar_Calculation.js`.
- **Data Transformation**: Transform kWh Data using `Transform_kWh.js`.
- **Google Sheets**: Database.
- **EmailOctopus**: Analysis in Automated Email.

## API Credentials
This project requires a Google Cloud and CloudConvert Keys for the Vision API.
- Include the `Synergy_GoogleVisionAPIDummy.json` file in your project directory.
- Edit `Synergy_GoogleVisionAPIDummy.json` and replace the placeholder values with your actual credentials:
   - `project_id`: Your Google Cloud project ID
   - `private_key_id`: Your private key ID
   - `private_key`: Your private key (including the BEGIN and END markers)
   - `client_email`: Your service account email
   - `client_id`: Your client ID
- Never commit JSON file to version control. Ensure it is added to `.gitignore`.

## Usage
Use PipeDream or N8N as Orchestration
```
Steps Required
- Webhook Trigger 
- Node JS Code (4 Actions)
- Google Sheets - Add Single Row (Optional Database)
- EmailOctopus - Add Subscriber to List (Send Analysis)
```

Run the JavaScript per Tasks
```
- Extract Data: "node Extract_Data.js"
- Solar Calculations: "node Solar_Calculation.js"
- Transform kWh Data: "node Transform_kWh.js"
```

## License
This project is under the MIT License. See the [LICENSE] file for details.

## Open Source Purposes
This code was designed for Synergy Energy, a panamanian company focus in solar panels deployment and energy efficiency, as part of a cooperation agreetment with the E-Mobility Chamber of Panama (CAMEPA). Feedback, contributions, and collaborations to improve this tool or adapt it to other markets are welcome. If you're interested in deploying this code for your own energy analysis projects, feel free to reach out or fork the repository. 