# lichen
Before running `data-loader`, make sure that the AWS CLI is installed and configured and the `~/.aws/credentials` file includes your IAM user's access key and secret:

```
[default]
aws_access_key_id=XXX
aws_secret_access_key=XXX
```

Before running the data loader, a DynamoDB table named `SiteInventories` must first be created with a partition key named `SiteCode` of type string. After cloning this project and moving into the root of the project directory, run the following to load the site inventories into your database:

```
$> npm install
$> node data-loader
```
Check the AWS console to verify that the inventories were added.
