from diagrams import Cluster, Diagram
from diagrams.aws.management import Cloudformation
from diagrams.aws.compute import Lambda
from diagrams.aws.database import Dynamodb
from diagrams.aws.network import APIGateway, CloudFront
from diagrams.aws.storage import S3
from diagrams.aws.integration import SNS, SQS 
from diagrams.aws.compute import Fargate

with Diagram("FormKiQ Quickstart", show=False):

    cf = Cloudformation("AWS CloudFormation")

    with Cluster("AWS Data Services"):
        data_services = S3("Storage")
        data_services - Dynamodb("Data Store")

    with Cluster("AWS Message Services"):
        message_services = SQS("Message Queue")
        message_services - SNS("Message Service")

    with Cluster("AWS Compute Services"):
        # compute_services = APIGateway("API")
        compute_services = Lambda("Compute")
        compute_services - Fargate("Services")

    cf >> compute_services
    cf >> data_services
    cf >> message_services