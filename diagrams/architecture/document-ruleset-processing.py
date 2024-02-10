from diagrams import Cluster, Diagram, Edge
from diagrams.aws.general import User
from diagrams.aws.compute import Lambda
from diagrams.aws.network import APIGateway
from diagrams.aws.integration import SNS, SQS

with Diagram("Document Ruleset Processing", show=False):

    api = APIGateway("Documents API")
    lambda_processor = Lambda("Workflow Processor")
    sqs_processing = SQS("Rulesets")
   
    staging = User("User")
    staging - Edge(label="Create Document") - api - Edge(label="Document Event") - sqs_processing - Edge(label="Start Workflow") - lambda_processor