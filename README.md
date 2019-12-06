# Stockiment

In the modern age of investing, the availability of data on investor sentiment allows us to extrapolate future buying and selling decisions based on mass media. In this project, we will attempt to use sentiment analysis to predict stock market valuation in the short term.
  1. We are performing NLP analysis on Tweets relevant to the stock/company.
  2. Using these quantitative results from the NLP analysis we will attempt to predict the value of the stock in the near     future.
  3. Inform users of the stocks that we predict will go up or down.
  4. Provide users with trending tweets about each company to provide further insight and relevant news.

## Getting Started

### Prerequisites

Install Node.js and npm

### Installing

In order to test the code which uses Amazon SNS service in sns folder. Install aws

```
npm install aws-sdk
```
You need a aws account and access for Amazon SNS service. Check out the link below and follow the instructions to obtain your SNS credentials.
[Setting Up Access for Amazon SNS](https://docs.aws.amazon.com/sns/latest/dg/sns-setting-up.html)

Once you obtain your credentials, update it to the config by running this in terminal:
```
export AWS_ACCESS_KEY_ID=yourkey
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=your_aws_region
```

## Running the server

In the directory which you cloned this project in, run 

```
node api/server.js
```
Once the server is running, go check out the frontend git repo and start the frontend to see the webpage.

[Video link](https://youtu.be/hm0xJztueTY)

## Authors

* Collin Kauss 
* Jinyuan Li
* William Sheung 
* Zhaojie Tang 
