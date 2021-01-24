import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");

class AzureCV {

  static computerVisionKey = process.env.REACT_APP_CV_KEY;
  static computerVisionEndPoint = process.env.REACT_APP_CV_ENDPOINT;
  static cognitiveServiceCredentials = new CognitiveServicesCredentials(AzureCV.computerVisionKey);
  static client = new ComputerVisionClient(AzureCV.cognitiveServiceCredentials, AzureCV.computerVisionEndPoint as string);

  // Perform read and await the result from URL
  static async readTextFromURL(client: ComputerVisionClient, url: string) {
    const STATUS_SUCCEEDED = "succeeded";

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    let result: any = await client.read(url);
    let operation = result.operationLocation.split('/').slice(-1)[0];

    // Wait for read recognition to complete
    // result.status is initially undefined, since it's the result of read
    while (result.status !== STATUS_SUCCEEDED) {
      await delay(1000);
      result = await client.getReadResult(operation);
    }
    return result.analyzeResult.readResults;
  }

  static async getDescription(url: string): Promise<string> {
    console.log(AzureCV.computerVisionKey);
    console.log(AzureCV.computerVisionEndPoint);

    const captions = (await AzureCV.client.describeImage(url)).captions;
    if (captions && captions.length > 0) {
      return captions[0].text as string;
    }
    else {
      return "No descriptions generated."
    }
  }
  // Prints all text from Read result
  static printTextResults(readResults: any): void {
    console.log('Recognized text:');
    for (const page in readResults) {
      if (readResults.length > 1) {
        console.log(`==== Page: ${page}`);
      }
      const result = readResults[page];
      if (result.lines.length) {
        for (const line of result.lines) {
          console.log(line.words.map((w: any) => w.text).join(' '));
        }
      }
      else { console.log('No recognized text.'); }
    }
  }

  static async analyzeImage(url: string): Promise<void> {

    const printedResult = await AzureCV.readTextFromURL(AzureCV.client, url);
    AzureCV.printTextResults(printedResult);
    AzureCV.client
      .describeImage(url)
      .then((result: any) => {
        console.log("The result is:");
        console.log(result);
      })
      .catch((err: any) => {
        console.log("An error occurred:");
        console.error(err);
      });
  }
}

export default AzureCV;