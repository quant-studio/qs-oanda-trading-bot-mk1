# Multi-Timeframe SMA Cross - M1

## The bot




### Install (local)

Clone the repository

	git clone git@github.com:quant-studio/qs-oanda-trading-bot-mk1.git

Open a console, `cd` into the directory, then install the dependencies:

	npm install

Create env vars to save your Oanda API key & your Oanda Account Number (or hard-code them in app.js line 18 & 19):

	OANDA_API_KEY=13a5f4284fa8598ac37c445e0ef0fa3a-cr45169bceer7a1318c0nde3292o15e9
	OANDA_ACC=131-011-3347965-011

(invalid keys & acc number, just for the example. Replace with your owns.)

Test locally:

	node test

### Deployment on AWS Lambda

On your AWS console, open **CodeStar**, and filter to only show the templates for Web Services in NodeJS, and select the "AWS Lambda" template.

![CodeStart Step 1](https://i.imgur.com/SOSZRlz.png)

Select a name, then connect your github account. 

![CodeStart Step 1](https://i.imgur.com/v0voCk4.png)

Click **Next** until the end. Leave everything as default.

CodeStar will create a new github repository on your github account. It might take a few minutes.

### Clone the github repository you just created with CodeStar.

Copy the following files into your repository:

- app.js
- bot.js
- core.js
- index.js
- oanda.js
- package.json
- test.js
- .gitignore
- buildspec.yml

### Deploy

To deploy, just push to github. CodeStar will monitor your github repository and trigger a rebuild of your lambda function everytime there is a new commit to `master`.

	git add --all && git commit -m "Base code" && git push

It takes a few minutes for your code to deploy & build on lambda.

You can follow the deployment and investigate any deployment issues by looking at your CodePipeline console.
Open CodePipeline, locate your bot, and the UI is pretty self-explanatory:

![CodeStart Step 1](https://i.imgur.com/rnn5Qkz.png)

Once deployed, you can setup & test your bot.


### Configure your lambda function

By default, your lambda function has a 3 seconds timeout & barely any memory allocated. That won't work for this.

Go to your AWS console, then open AWS Lambda.

Look for your bot in the list:

![CodeStart Step 1](https://i.imgur.com/uPDflTK.png)

When you are on your bot's lambda settings, scroll down until you see **Basic Settings**:

![CodeStart Step 1](https://i.imgur.com/BKgjTMv.png)

Even though AWS will charge you more when you use more memory, you also get charged for the execution time. Counter-intuitively, it's usually cheaper to allocate more memory, as it speeds up the execution time quite significantly.

Here are my settings:

![CodeStart Step 1](https://i.imgur.com/YkY3JN2.png)

Now you'll want to setup the env vars, to provide the Oanda API key & account number without having to hard-code them in your code and risk accidentally pushing them to github.

Scroll back up and locate *Environment variables*:

Create the `OANDA_API_KEY` and `OANDA_ACC` env vars, along with their values:

![CodeStart Step 1](https://i.imgur.com/jR35jaA.png)

There is a link on your OANDA fxTrade account profile page titled “Manage API Access” (My Account -> My Services -> Manage API Access). From there, you can generate a personal access token to use with the OANDA API, as well as revoke a token you may currently have.

Don't forget to save, and you're ready to test.

### Testing your AWS Lambda deployment

Scroll all the way up, locate the test UI and click "Select a test event":

![CodeStart Step 1](https://i.imgur.com/Y6pjTYL.png)

Create a new test.
Leave the parameters empty (we don't need any), and give it a neme, then click **Create**:

![CodeStart Step 1](https://i.imgur.com/0YaUvMM.png)

Now select & execute your test:

![CodeStart Step 1](https://i.imgur.com/xOo54wn.png)


### Schedule the execution of your code

In your AWS console, open CloudWatch.

Go to Events > Rules, then click *Create Rule*:

![CodeStart Step 1](https://i.imgur.com/KtwGhp8.png)


Select *schedule* then *Cron expression*.

If you want to execute your bot every hour Monday to Friday for example, you'd use:

	0/60 * ? * MON-FRI *


*Note: Check  [the official doc](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) to understand the cron format.*


On the right side, select your lambda function:

![CodeStart Step 1](https://i.imgur.com/iqEHuGk.png)


Leave everything as default and click **Configure Details**

On the next step, give your rule a name, a description, then click **Create**.

![CodeStart Step 1](https://i.imgur.com/H2qX4n0.png)

### Checking the logs

To check the execution logs of your bot and make sure everythign is working as expected, in your AWS console open CloudWatch.

On the left click *Logs* then look for the log starting with */aws/lambda/awscodestar-* + the name of your bot.

If you don't find a log group for your bot, that means your bot hasn't been executed yet.

Wait for it to execute or execute it manually or via a test to start creating logs.

### Finding your bot's GET endpoint to trigger it manually

In your AWS console open *API Gateway*.
Look for the name of your bot and go to *Stages*.

Click "Prod", and you'll find your endpoint's url:

![CodeStart Step 1](https://i.imgur.com/DbSbllH.png)

Open that url in your browser to execute the bot.

The bot doesn't return anything as an HTTP response right now, you you should get `{}` as a response.




























## The Quant Studio Algorithm:
### Requirements

- Nodejs V8.0.0 or more recent

### Files

- `MultiTimeframeSMACrossM1.js` is your algorithm, including its datasources.
- `simple-stats.js` is a required dependency of your algorithm. Keep this file in the same directory as `MultiTimeframeSMACrossM1.js`.

### Installation

`npm install`

### Execute the demo:

` node demo`

### How to use

**Load your algorithm:**

	var MultiTimeframeSMACrossM1	= require("./MultiTimeframeSMACrossM1");

**Execute your algorithm:**

Each datasources will refresh its data and the algorithm will be executed, returning an array of objects. Each object represents a datapoint.

	MultiTimeframeSMACrossM1.refresh({
		rights: {
		    "ebbfe4432a": {
		        "oanda_api_key": ""	// Use your own API key
		    },
		    "098f004b68": {
		        "oanda_api_key": ""	// Use your own API key
		    }
		}
	}, function(response) {
		console.log(JSON.stringify(response, null, 4));
	});

### Output Schema

Your function `MultiTimeframeSMACrossM1(dataset)` outputs an array of objects, each containing the following keys:

- `open`: open (Candles)
- `high`: high (Candles)
- `low`: low (Candles)
- `close`: close (Candles)
- `volume`: volume (Candles)
- `Date`: Date (Candles)
- `spread`: spread (Candles)
- `open`: open (Candles)
- `high`: high (Candles)
- `low`: low (Candles)
- `close`: close (Candles)
- `volume`: volume (Candles)
- `Date`: Date (Candles)
- `spread`: spread (Candles)
- `Output`: Output (H1 to M1)
- `_fastH1`: H1 Fast (SMA)
- `_slowH1`: H1 Slow (SMA)
- `fastM1`: M1 Fast (SMA)
- `slowM1`: Slow M1 (SMA)
- `lt`: lt (_ < _)
- `lt`: lt (_ < _)
- `fastH1`: Fast (H1 to M1)
- `slowH1`: Slow (H1 to M1)
- `buyLevel`: Buy Level (Plus - Minus)
- `sellLevel`: Sell Level (Plus - Minus)
- `RSI`: RSI (RSI)
- `RSI-1`: RSI (RSI)
- `rsiH1`: H1 RSI (H1 to M1)
- `medM1`: Medium M1 (SMA)
- `med2M1`: Medium 2 M1 (SMA)
- `lt`: lt (_ < _)
- `lt`: lt (_ < _)
- `Binary AND`: Binary AND (AND (x4))
- `sell`: Sell (Pulse)
- `superfastM1`: Superfast M1 (SMA)
- `superfastTriggerM1`: Superfast Trigger M1 (SMA)
- `RSITrigger`: RSI Trigger (RSI)
