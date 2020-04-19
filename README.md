# Lichen Project Backend
The purpose of this repo is to facilitate site inventory and EA data information to be uploaded into and served from a cloud-hosted DynamoDB database. After uploading, the data is available to the [Lichen Project Frontend](https://github.com/adambayer14/lichenproject) for examination.

## Data Loader
A command-line data loader application (`data-loader`) is provided for the purpose of copying data from a local tab-delimited file up to the cloud-based database. The site inventory and EA data spreadsheet files were converted to tab-delimited files rather than CSV because some of the data contains commas.

### AWS Setup

The Lichen Project Backend requires an Amazon Web Services (AWS) account for hosting. You can sign up for an account here:

[https://aws.amazon.com/](https://aws.amazon.com/)

Once the account has been created, the AWS CLI (command-line interface) tool must be installed on the machine from which the data will be loaded. You can find instructions for doing that here:

[https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

The `data-loader` will leverage the AWS CLI in order to push data into the AWS environment. To do this, you'll need to identify your account and specify the AWS region you'd like to use whenever calling Amazon. You can find instructions on doing that here:

[https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html)

### Node.js and Git Installation

Next, you'll need to install Node.js since the `data-loader` is a JavaScript application that requires an execution environment. You can download and install it from here:

[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

If you don't have `git` installed, you'll need to do that next. Here are some instructions:

[https://git-scm.com/book/en/v2/Getting-Started-Installing-Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

You can now clone the Lichen Project Backend repo on your local machine:

```
git clone https://github.com/tacallaway/lichen
```

### Backend Deployment and Data Load

After you've cloned the project, move into the project root directory and run:

```
npm install && npm run deploy
```

This will install the local project dependencies and deploy the Lichen Project Backend to AWS. Finally, you're ready to run the data loader and upload data to the cloud with this command:

```
npm run load-data
```

Notice that if you don't provide the path to a site inventory and EA data file you'll get this response:

```
Usage: npm run load-data <site_inventory_file> <EA_data_file>
```

To complete the process, add the path to the site inventories and EA data files you'd like to load. Here's an example:

```
npm run load-data data/site_inventories_FINALDATA_21March2019.txt data/EA_data_half_loc.txt
```

At this point, you should see a list of the site IDs for each site uploaded to the server. This completes the backend installation process. Please see the [Lichen Project Frontend](https://github.com/adambayer14/lichenproject) for more information.
